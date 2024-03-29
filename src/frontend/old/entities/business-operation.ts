import { isObjectDefinition, ObjectDefinition } from "@meta-system/object-definition";
import type {
  BopsConfigurationEntry,
  BopsConstant,
  BopsVariable,
  BopsCustomObject,
  BusinessOperations } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { ModuleCard, SerializedModuleCard, UICompliantDependency } from "../common/types/module-card";
import { writable, Writable, readable, Readable, get } from "svelte/store";
import { Coordinate } from "../common/types/geometry";
import { availableConfigurations, currentConfigId } from "../stores/configuration-store";
import type { PropertyListEntry } from "../common/types/property-list-entry";
import { nanoid } from "nanoid";
import type { Serialized } from "./serialized-type";
import type { ConnectionPointVertex } from "../components/architect/helpers/connection-vertex";
import type { ModuleConnection } from "../components/architect/helpers/module-connection";
import type { Protocol } from "./protocol";
import type { EnvironmentVariable } from "./environment-variable";

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
      position: new Coordinate(250, 0),
      bopId: get(this.id),
      moduleName: "output",
      moduleType: "output",
      key: -2,
    });

    this.input = ModuleCard.generate({
      position: new Coordinate(0, 0),
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
      const bops = configs.find(config => get(config.id) === get(currentConfigId))?.protocols as Protocol[];
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
    return get(this.configuration).find((item) => item.moduleType === "output") as ModuleCard;
  }

  // eslint-disable-next-line max-lines-per-function
  private rebuildConfigurationForUI (configuration : SerializedModuleCard[])
    : ModuleCard[] {
    const result : Array<ModuleCard> = [];

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

  public exportable () : BusinessOperations {
    return ({
      name: get(this.name),
      customObjects: get(this.customObjects),
      input: get(this.input.storedDefinition).output,
      output: get(this.output.storedDefinition).input,
      constants: get(this.constants),
      variables: get(this.variables),
      configuration: get(this.configuration).map(dependency => dependency.exportable()),
    });
  }

  /** Creates a connection between any modules' props. This function already
   * figures out which one is the origin and which is the target, and registers the connection
   * into the connections manager.
   */
  // eslint-disable-next-line max-lines-per-function
  public solveConnection (
    currentConnectionPoint : ConnectionPointVertex,
    targetConnectionPoint : ConnectionPointVertex,
  ) : void {
    if(currentConnectionPoint === undefined) return;
    if(currentConnectionPoint.type === targetConnectionPoint.type) return;

    const currentIsOutput = ["output", "module", "functionalOrigin"].includes(currentConnectionPoint.type);
    const [origin, target] = currentIsOutput
      ? [currentConnectionPoint, targetConnectionPoint]
      : [targetConnectionPoint, currentConnectionPoint];

    if(target.type === "functionalTarget") return this.addFunctionalDependency(origin, target);

    // eslint-disable-next-line max-lines-per-function
    this.configuration.update((modules) => {
      const targetModule = modules.find(module => module.key === target.parentKey) as ModuleCard;

      const firstPathStep = origin.parentKey === "input" ? ""
        : origin.type === "output" ? "result." : "module.";

      // if it is root modular dependency
      const originPath = get(origin.propertyPath) === "" && firstPathStep !== "" ? "module"
        : `${firstPathStep}${get(origin.propertyPath)}`;

      const newDependency : UICompliantDependency = {
        origin: origin.parentKey,
        originPath,
        targetPath: get(target.propertyPath),
        matchingType: (get(origin.propertyType) === get(target.propertyType)) || get(target.propertyType) === "any",
      };

      let conflictingIndex = targetModule.getConflictingDependencyIndex(newDependency.targetPath as string);
      while (conflictingIndex !== -1) {
        targetModule.dependencies.update((currentValue) => {
          currentValue.splice(conflictingIndex, 1); return currentValue;});
        conflictingIndex = targetModule.getConflictingDependencyIndex(newDependency.targetPath as string);
      }

      targetModule.dependencies.update((currentValue) => { currentValue.push(newDependency); return currentValue; });

      return modules;
    });

    return undefined;
  }

  private getArrayPath (path : string) : string {
    const indexSeparatorDot = path.lastIndexOf(".");
    const [partialPath, index] = [path.slice(0, indexSeparatorDot), path.slice(indexSeparatorDot+1)];
    console.log(indexSeparatorDot, partialPath, index);
    return `${partialPath}[${index}]`;
  }

  // eslint-disable-next-line max-lines-per-function
  public setStaticConnection (
    moduleKey : number,
    targetPath : string,
    staticConnectionData : BopsConstant | BopsVariable | EnvironmentVariable,
  ) : void {
    // eslint-disable-next-line max-lines-per-function
    this.configuration.update((modules) => {
      const targetModule = modules.find((module) => module.key === moduleKey) as ModuleCard;

      let conflictingIndex = targetModule.getConflictingDependencyIndex(targetPath);
      while (conflictingIndex !== -1) {
        targetModule.dependencies.update((currentValue) => {
          currentValue.splice(conflictingIndex, 1); return currentValue;});
        conflictingIndex = targetModule.getConflictingDependencyIndex(targetPath);
      }

      targetModule.dependencies.update((deps) => {
        const origin = staticConnectionData["key"] !== undefined ? "env" :
          staticConnectionData["value"] !== undefined ? "constant" : "variable";

        const originPath = origin === "env" ? get((staticConnectionData as EnvironmentVariable).key) :
          (staticConnectionData as BopsConstant).name;

        const dependencyValue : UICompliantDependency = {
          origin,
          originPath,
          targetPath,
        };
        deps.push(dependencyValue);
        return deps;
      });

      return modules;
    });
  }

  // eslint-disable-next-line max-lines-per-function
  private addFunctionalDependency (
    origin : ConnectionPointVertex, target : ConnectionPointVertex) : void
  {
    this.configuration.update(modules => {
      const targetModule = get(this.configuration).find(module => module.key == target.parentKey) as ModuleCard;
      const targetModuleDependencies = get(targetModule.dependencies);
      const alreadyPresent = targetModuleDependencies.findIndex(dependency => {
        return dependency.origin === origin.parentKey && dependency.targetPath === undefined;
      });
      if(alreadyPresent !== -1) {
        targetModule.dependencies.update((currentValue) => {
          currentValue.splice(alreadyPresent, 1); return currentValue; });
      }

      targetModule.dependencies
        .update((currentValue) => { currentValue.unshift({ origin: origin.parentKey }); return currentValue; });
      return modules;
    });
  }

  public getModuleByKey (key : number) : ModuleCard {
    return get(this.configuration).find((module) => module.key === key) as ModuleCard;
  }

  // eslint-disable-next-line max-lines-per-function
  public removeDependency (moduleConnection : ModuleConnection) : void {
    const dependencyData = moduleConnection.getDependency();

    const module = get(this.configuration)
      .find((moduleCard) => dependencyData.targetModule === moduleCard.getBopTransformedKey()) as ModuleCard;

    module.dependencies.update((dependencies) => {
      const dependencyIndex = dependencies
        .findIndex((dependency) => dependency.origin === dependencyData.origin
          && dependency.originPath === dependencyData.originPath
          && dependency.targetPath === dependencyData.targetPath,
        );

      dependencies.splice(dependencyIndex, 1);
      return dependencies;
    });
  }

  public removeStaticDependency (type : "constant" | "variable", name : string) : void {
    get(this.configuration).forEach((module) => {
      const index = get(module.dependencies).findIndex((dep) => dep.originPath === name && dep.origin === type);
      if (index === -1) { return; }

      module.dependencies.update((deps) => {
        deps.splice(index, 1);
        return deps;
      });
    });
  }

  public removeConstant (name : string) : void {
    const index = get(this.constants).findIndex((constEl) => constEl.name === name);
    if (index === -1) { return; }

    this.constants.update((consts) => {
      consts.splice(index,1);

      return consts;
    });

    this.removeStaticDependency("constant", name);
  }

  public removeVariable (name : string) : void {
    const index = get(this.variables).findIndex((varsEl) => varsEl.name === name);
    if (index === -1) { return; }

    this.variables.update((consts) => {
      consts.splice(index,1);

      return consts;
    });

    this.removeStaticDependency("variable", name);
  }

  // eslint-disable-next-line max-lines-per-function
  public updateConst (oldName : string, newConstAttributes : BopsConstant) : void {
    this.constants.update((constants) => {
      const constIndex = constants.findIndex((c) => c.name === oldName);
      constants[constIndex] = newConstAttributes;
      return constants;
    });

    get(this.configuration).forEach((module) => {
      const index = get(module.dependencies)
        .findIndex((dep) => dep.originPath === oldName && dep.origin === "constant");
      if (index === -1) { return; }

      module.dependencies.update((deps) => {
        deps[index] = { ...deps[index], originPath: newConstAttributes.name };
        return deps;
      });
    });
  }

  // eslint-disable-next-line max-lines-per-function
  public updateVariable (oldName : string, newVarAttributes : BopsVariable) : void {
    this.variables.update((vars) => {
      const constIndex = vars.findIndex((v) => v.name === oldName);
      vars[constIndex] = newVarAttributes;
      return vars;
    });

    get(this.configuration).forEach((module) => {
      const index = get(module.dependencies)
        .findIndex((dep) => dep.originPath === oldName && dep.origin === "variable");
      if (index === -1) { return; }

      module.dependencies.update((deps) => {
        deps[index] = { ...deps[index], originPath: newVarAttributes.name };
        return deps;
      });
    });
  }
}
