import type { Dependency } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import type { ConnectionPointSelection } from "src/stores/knob-selection-type";
import { get } from "svelte/store";
import type { ModuleCard } from "../../../common/types/module-card";

export class SectionsMap {
  // TODO change these records to literal Maps
  public output : Record<string, HTMLSpanElement> =  {};
  public module = this.output;
  public input : Record<string, HTMLSpanElement> =  {};
  public functional : Record<string, HTMLSpanElement> = {};

  public connections : Record<string, string[]> = {};
  public functionalConnections : Record<string, string[]> = {};

  public activeLinkingOrigin : HTMLSpanElement = undefined;
  public hoveredFunctionalKnob : Array<string> = [];

  public static getIdentifier (
    key : string | number, path : string, type ?: ConnectionPointSelection["connectionType"]) : string {
    const typeStep = type === "output" ? "result." : type === "module" ? "module." : "";
    const isInput = key === "input";

    return isInput ? `${key}.${path}` : `${key}.${typeStep}${path ?? ""}`;
  }

  public addConnection (
    newDependency : Dependency,
    targetKey : number | "input",
    outputType ?: ConnectionPointSelection["connectionType"],
  ) : void {
    const outputPath = newDependency.originPath;

    let outputId = SectionsMap.getIdentifier(newDependency.origin, outputPath, outputType);
    const targetId = SectionsMap.getIdentifier(targetKey, newDependency.targetPath);
    if(outputPath === undefined) outputId = outputId + "module";
    const isFunctional = newDependency.originPath == undefined && newDependency.targetPath == undefined;
    const connections = isFunctional ? this.functionalConnections : this.connections;

    if(connections[outputId] === undefined) connections[outputId] = [];
    connections[outputId].push(targetId);
  }

  public removeConnection (inputIdentifier : string) : void {
    for(const outputId of Object.keys(this.connections)) {
      const connectionIndex = this.connections[outputId].indexOf(inputIdentifier);
      if (connectionIndex !== -1) {
        this.connections[outputId].splice(connectionIndex, 1);
        return;
      }
    }
  }

  private connectModule (module : ModuleCard) : void {
    for(const dependency of get(module.dependencies)) this.addConnection(dependency, module.key);
  }

  private connectModules (modules : ModuleCard[]) : void {

    for(const module of modules) this.connectModule(module);
  }

  private isNill (value : unknown) : boolean { return value === undefined || value === null; }

  // eslint-disable-next-line max-lines-per-function
  private solveDeepConnections () : void {
    for(const output in this.connections) {
      const outputSteps = output.split(".");
      while(this.isNill(this.output[outputSteps.join(".")]) && outputSteps.length > 0) {
        outputSteps.pop();
      }

      if(outputSteps.length === 0) delete this.connections[output];
      else {
        const correctedOutId = outputSteps.join(".");
        if(output !== correctedOutId) {
          this.connections[outputSteps.join(".")] =
            [...this.connections[output], ...this.connections[outputSteps.join(".")] ?? []];
          delete this.connections[output];
        }


        for(const input of this.connections[correctedOutId]) {
          const inSteps = input.split(".");
          while(this.isNill(this.input[inSteps.join(".")]) && inSteps.length > 0) inSteps.pop();
          const inputIndex = this.connections[correctedOutId].indexOf(input);
          if(inSteps.length === 0) this.connections[correctedOutId].splice(inputIndex, 1);
          else this.connections[correctedOutId][inputIndex] = inSteps.join(".");
        }
        this.removeDuplicates(correctedOutId);
      }
    }
  }

  private removeDuplicates (outputId : string) : void {
    for(const input of this.connections[outputId]) {
      while(this.connections[outputId].filter(inputId => inputId === input).length > 1) {
        const inputIndex = this.connections[outputId].indexOf(input);
        this.connections[outputId].splice(inputIndex, 1);
      }
    }
  }

  public refreshConnections (bopModules : ModuleCard[]) : void {
    this.connections = {};
    this.functionalConnections = {};
    this.connectModules(bopModules);
    this.solveDeepConnections();
  }
}


const sectionsMap = new SectionsMap();

export { sectionsMap };
