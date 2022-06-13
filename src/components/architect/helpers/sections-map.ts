import type {
  BopsConfigurationEntry,
  Dependency } from "meta-system/dist/src/configuration/business-operations/business-operations-type";

export class SectionsMap {
  public output : Record<string, HTMLSpanElement> =  {};
  public input : Record<string, HTMLSpanElement> =  {};
  public connections : Record<string, string[]> = {};

  public static getIdentifier (key : string | number, path : string) : string {
    return `${key}.${path}`;
  }

  public addConnection (newDependency : Dependency, targetKey : number | "input") : void {
    const outputPath = newDependency.origin === "input" ?
      `result.${newDependency.originPath}` :
      newDependency.originPath;
    const outputId = SectionsMap.getIdentifier(newDependency.origin, outputPath);
    const targetId = SectionsMap.getIdentifier(targetKey, newDependency.targetPath);
    if(this.connections[outputId] === undefined) this.connections[outputId] = [];
    this.connections[outputId].push(targetId);
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

  private connectModule (module : BopsConfigurationEntry) : void {
    for(const dependency of module.dependencies) this.addConnection(dependency, module.key);
  }

  private connectModules (modules : BopsConfigurationEntry[]) : void {
    for(const module of modules) this.connectModule(module);
  }

  private isNill (value : unknown) : boolean { return value === undefined || value === null; }

  // eslint-disable-next-line max-lines-per-function
  private solveDeepConnections () : void {
    for(const output in this.connections) {
      const outSteps = output.split(".");
      while(this.isNill(this.output[outSteps.join(".")]) && outSteps.length > 0) {
        outSteps.pop();
      }
      if(outSteps.length === 0) delete this.connections[output];
      else {
        const correctedOutId = outSteps.join(".");
        if(output !== correctedOutId) {
          this.connections[outSteps.join(".")] =
            [...this.connections[output], ...this.connections[outSteps.join(".")] ?? []];
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

  public refreshConnections (bopModules : BopsConfigurationEntry[]) : void {
    this.connections = {};
    this.connectModules(bopModules);
    this.solveDeepConnections();
  }
}


const sectionsMap = new SectionsMap();

export { sectionsMap };
