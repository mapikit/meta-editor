import { isObjectDefinition, ObjectDefinition } from "@meta-system/object-definition";
import type {
  BopsConfigurationEntry,
  BopsConstant,
  BopsVariable,
  BopsCustomObject } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { ModuleCard, SerializedModuleCard, UICompliantDependency } from "../common/types/module-card";
import { writable, Writable, readable, Readable, get } from "svelte/store";
import { Coordinate } from "../common/types/geometry";
import { availableConfigurations, currentConfigId } from "../stores/configuration-store";
import type { PropertyListEntry } from "../common/types/property-list-entry";
import { nanoid } from "nanoid";
import type { Serialized } from "./serialized-type";
import type { ConnectionPointSelection } from "../stores/knob-selection-type";
import { SectionsMap, sectionsMap } from "../components/architect/helpers/sections-map";
import { updateTraces } from "../components/architect/update-traces";
// TODO The right thing here, since this is a high level class, is to receive this as a
// property in the constructor instead of simply importing this.

export type BOpParameters = {
  id : string,
  name : string,
  description : string,
  input : SerializedModuleCard | ObjectDefinition,
  output : SerializedModuleCard | ObjectDefinition,
  configuration : SerializedModuleCard[],
  constants : BopsConstant[],
  variables : BopsVariable[],
  customObjects : BopsCustomObject[],
  isLocked : boolean,
  isStarred : boolean,
}

export class UIBusinessOperation {
  public readonly configuration : Writable<ModuleCard[]> = writable([]);
  public readonly id : Readable<string>;
  public readonly input : ModuleCard;
  public readonly constants : Writable<BopsConstant[]>;
  public readonly variables : Writable<BopsVariable[]>;
  public readonly name : Writable<string>;
  public readonly description : Writable<string>;
  public readonly output : ModuleCard;
  public readonly customObjects : Writable<BopsCustomObject[]>;
  public readonly isStarred : Writable<boolean> = writable(false);
  public readonly isLocked : Writable<boolean> = writable(false);

  // eslint-disable-next-line max-lines-per-function
  constructor ({
    id, name, description, input, output, configuration, constants, customObjects, variables, isLocked, isStarred,
  } : BOpParameters) {
    this.id = readable(id);
    this.name = writable(name);
    this.description = writable(description);
    this.constants = writable(constants);
    this.variables = writable(variables);
    this.customObjects = writable(customObjects);
    this.isLocked = writable(isLocked);
    this.isStarred = writable(isStarred);

    this.output = ModuleCard.generate({
      position: new Coordinate(0, 0),
      bopId: get(this.id),
      moduleName: "output",
      moduleType: "output",
      key: -2,
    });

    this.input = ModuleCard.generate({
      position: new Coordinate(200, 0),
      bopId: get(this.id),
      moduleName: "Input",
      moduleType: "internal",
      key: -1,
    });

    this.validateInput(input);
    this.configuration.set(this.rebuildConfigurationForUI(configuration));
    const existingOutput = this.getOutputFromConfiguration();
    if (existingOutput) {
      this.output = existingOutput;
    } else {
      this.validateOutput(output);
    }
  }

  public static deleteBop (id : string) : void {
    availableConfigurations.update(configs => {
      const bops = configs.find(config => get(config.id) === get(currentConfigId)).protocols;
      const itemIndex = bops.findIndex((bop) => get(bop.id) === id);
      bops.splice(itemIndex, 1);
      return configs;
    });
  }

  public getCardInfo () : PropertyListEntry {
    return {
      type: "BOp",
      id: get(this.id),
      name: this.name,
      locked: this.isLocked,
      starred: this.isStarred,
      description: this.description,
      dataValues: [],
    };
  }

  // eslint-disable-next-line max-lines-per-function
  public static createNewBOp () : UIBusinessOperation {
    const newBop = new UIBusinessOperation({
      id: nanoid(),
      name: "New BOp",
      configuration: [],
      constants: [],
      variables: [],
      customObjects: [],
      description: "BOp Description",
      input: {},
      output: {},
      isLocked: false,
      isStarred: false,
    });

    return newBop;
  }

  private validateInput (input : SerializedModuleCard | ObjectDefinition) : void {
    try { isObjectDefinition(input); }
    catch {
      const position = (input as SerializedModuleCard).position;
      this.input.position.set(position ? new Coordinate(position.x, position.y) : new Coordinate(0, 0));
      this.input.storedDefinition.set((input as SerializedModuleCard).storedDefinition ?? { input: {}, output: {} });

      return;
    }

    this.input.storedDefinition.set({ input: {}, output: input });
  }

  // eslint-disable-next-line max-lines-per-function
  private validateOutput (output : SerializedModuleCard | ObjectDefinition) : void {
    try { isObjectDefinition(output); }
    catch {
      const position = (output as SerializedModuleCard).position;
      this.output.position.set(position ? new Coordinate(position.x, position.y) : new Coordinate(0, 0));
      this.output.storedDefinition
        .set((output as SerializedModuleCard).storedDefinition ?? { input: {}, output: {} });

      this.configuration.set([this.output]);

      return;
    }

    this.output.storedDefinition.set({ input: output, output: {} });

    this.configuration.set([this.output]);
  }

  private getOutputFromConfiguration () : ModuleCard {
    return get(this.configuration).find((item) => item.moduleType === "output");
  }

  // eslint-disable-next-line max-lines-per-function
  private rebuildConfigurationForUI (configuration : SerializedModuleCard[])
    : ModuleCard[] {
    const result = [];

    for(const config of configuration) {
      const builtModuleCard = new ModuleCard(config);

      result.push(builtModuleCard);
    }

    return result;
  }

  // TODO Recursive search separating modules by their node depth in the tree (from output)
  // This would be used to intelligently assign their position (depth => xPos; modulesInSameDepth => yPos (Stack))
  // private getDepthTree (modules : BopsConfigurationEntry[]) : Array<BopsConfigurationEntry[]> {
  //   const depthTree = [];

  //   return depthTree;
  // }

  public addModule (module : BopsConfigurationEntry) : void {
    const convertedModule = this.convertModuleToUI(module);
    this.configuration.update(configuration => {
      configuration.push(convertedModule);
      return configuration;
    });
  }

  // eslint-disable-next-line max-lines-per-function
  private convertModuleToUI (module : BopsConfigurationEntry) : ModuleCard {
    const fallbackCoords = new Coordinate(Math.random() * 1414, Math.random() * 577);
    let position = new Coordinate(module["position"]["x"] ?? 0, module["position"]["y"] ?? 0);
    if(module["position"] === undefined) {
      position = fallbackCoords;
    }

    return new ModuleCard({
      position,
      bopId: get(this.id),
      id: nanoid(),
      dependencies: module.dependencies.map((dep) => ({ ...dep, matchingType: false })),
      storedDefinition: { input: {}, output: {} }, // TODO: get input and output data THIS WILL CAUSE BUGS IF NOT DONE
      moduleName: module.moduleName,
      key: module.key,
      moduleType: module.moduleType,
      modulePackage: module.modulePackage,
    });
  }

  public serialized () : Serialized<UIBusinessOperation> {
    return ({
      configuration: get(this.configuration).map((module) => module.serialize()),
      input: this.input.serialize(),
      id: get(this.id),
      constants: get(this.constants),
      variables: get(this.variables),
      name: get(this.name),
      description: get(this.description),
      output: this.output.serialize(),
      customObjects: get(this.customObjects),
      isStarred: get(this.isStarred),
      isLocked: get(this.isLocked),
    });
  }

  public exported () : object {
    return ({
      name: get(this.name),
      description: get(this.description),
      input: get(this.input.storedDefinition).output,
      output: get(this.output.storedDefinition).input,
      constants: get(this.constants),
      variables: get(this.variables),
      configuration: get(this.configuration),
      customObjects: get(this.customObjects),
    });
  }

  /** Creates a connection between any modules' props. This function already
   * figures out which one is the origin and which is the target, and registers the connection
   * into the renderer.
   */
  // eslint-disable-next-line max-lines-per-function
  public solveConnection (
    currentConnectionPoint : ConnectionPointSelection,
    targetConnectionPoint : ConnectionPointSelection,
  ) : void {
    if(currentConnectionPoint === undefined) return;
    if(currentConnectionPoint.pointType === targetConnectionPoint.pointType) return;

    const currentIsOutput = ["output", "module"].includes(currentConnectionPoint.pointType);
    const [origin, target] = currentIsOutput
      ? [currentConnectionPoint, targetConnectionPoint]
      : [targetConnectionPoint, currentConnectionPoint];

    if(target.pointType === "functional") return this.addFunctionalDependency(origin, target);

    // eslint-disable-next-line max-lines-per-function
    this.configuration.update((modules) => {
      const targetModule = modules.find(module => module.key == target.parentKey);

      const firstPathStep = origin.parentKey === "input" ? ""
        : origin.pointType === "output" ? "result." : "module.";

      const newDependency : UICompliantDependency = {
        origin: origin.parentKey,
        originPath: `${firstPathStep}${origin.property}`,
        targetPath: target.property,
        matchingType: (origin.propertyType === target.propertyType) || target.propertyType === "any",
      };

      const targetModuleDependencies = get(targetModule.dependencies);
      const alreadyPresent = targetModuleDependencies
        .findIndex(dep => dep.targetPath === newDependency.targetPath);

      if(alreadyPresent !== -1) {
        get(targetModule.dependencies).splice(alreadyPresent, 1);
        targetModule.dependencies.update((currentValue) => currentValue.splice(alreadyPresent, 1));
        target.element.dispatchEvent(new Event("removeTag"));
        sectionsMap.removeConnection(SectionsMap.getIdentifier(targetModule.key, newDependency.targetPath));
      }

      targetModule.dependencies.update((currentValue) => { currentValue.push(newDependency); return currentValue; });
      sectionsMap.addConnection(newDependency, target.parentKey, target.pointType);

      return modules;
    });

    updateTraces();

    currentConnectionPoint.element.style.outline = "";
    return undefined;
  }

  // eslint-disable-next-line max-lines-per-function
  private addFunctionalDependency (
    origin : ConnectionPointSelection, target : ConnectionPointSelection) : void
  {
    if(origin.pointType !== "module") return window.alert("Functional Dependencies only connect to modules");

    this.configuration.update(modules => {
      const targetModule = get(this.configuration).find(module => module.key == target.parentKey);
      const targetModuleDependencies = get(targetModule.dependencies);
      const alreadyPresent = targetModuleDependencies.findIndex(dependency => {
        return dependency.origin === origin.parentKey && dependency.targetPath === undefined;
      });
      if(alreadyPresent !== -1) {
        targetModule.dependencies.update((currentValue) => currentValue.splice(alreadyPresent, 1));
      }

      targetModule.dependencies
        .update((currentValue) => { currentValue.unshift({ origin: origin.parentKey }); return currentValue; });
      return modules;
    });
  }
}
