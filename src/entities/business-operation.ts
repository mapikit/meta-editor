import { isObjectDefinition, ObjectDefinition } from "@meta-system/object-definition";
import type {
  BopsConfigurationEntry,
  BopsConstant,
  BopsVariable,
  BopsCustomObject } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { ModuleCard, SerializedModuleCard } from "../common/types/module-card";
import type { UIInput } from "../common/types/ui-input";
import { writable, Writable, readable, Readable, get } from "svelte/store";
import { Coordinate } from "../common/types/geometry";
import { businessOperations, saveConfigurations } from "../stores/configuration-store";
import type { PropertyListEntry } from "../common/types/property-list-entry";
import { nanoid } from "nanoid";

type SerializedBop = {
  id : string,
  name : string,
  description : string,
  input : UIInput | ObjectDefinition,
  output : ObjectDefinition,
  configuration : SerializedModuleCard[],
  constants : BopsConstant[],
  variables : BopsVariable[],
  customObjects : BopsCustomObject[],
  isLocked : boolean,
  isStarred : boolean,
}

export class UIBusinessOperation {
  public readonly configuration : Writable<ModuleCard[]> = writable([]);
  public readonly input : Writable<UIInput> = writable({ definition: undefined, position: undefined });
  public readonly id : Readable<string>;
  public readonly constants : Writable<BopsConstant[]>;
  public readonly variables : Writable<BopsVariable[]>;
  public readonly name : Writable<string>;
  public readonly description : Writable<string>;
  public readonly output : Writable<ObjectDefinition>;
  public readonly customObjects : Writable<BopsCustomObject[]>;
  public readonly isStarred : Writable<boolean> = writable(false);
  public readonly isLocked : Writable<boolean> = writable(false);

  // eslint-disable-next-line max-lines-per-function
  constructor ({
    id, name, description, input, output, configuration, constants, customObjects, variables, isLocked, isStarred,
  } : SerializedBop) {
    this.id = readable(id);
    this.name = writable(name);
    this.description = writable(description);
    this.output = writable(output);
    this.constants = writable(constants);
    this.variables = writable(variables);
    this.customObjects = writable(customObjects);
    this.isLocked = writable(isLocked);
    this.isStarred = writable(isStarred);

    this.validateInput(input);
    this.configuration.set(this.rebuildConfigurationForUI(configuration));

    this.keepStorageUpdated();
  }

  public static deleteBop (id : string) : void {
    businessOperations.update((list) => {
      const itemIndex = list.findIndex((bop) => get(bop.id) === id);

      list.splice(itemIndex, 1);

      return list;
    });

    saveConfigurations();
  }

  public getCardInfo () : PropertyListEntry {
    return {
      id: get(this.id),
      name: this.name,
      locked: this.isLocked,
      starred: this.isStarred,
      description: this.description,
      dataValues: [],
    };
  }

  // eslint-disable-next-line max-lines-per-function
  public static async createNewBOp () : Promise<void> {
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

    // adds it to the store
    businessOperations.update((value) => { value.push(newBop); return value; });
    saveConfigurations();
  }

  private validateInput (input : UIInput | ObjectDefinition) : asserts input is UIInput {
    const resolvedInput : UIInput = { definition: undefined, position: undefined };
    try { isObjectDefinition(input); }
    catch {
      const position = (input as UIInput).position;
      resolvedInput.position =  position ? new Coordinate(position.x, position.y) : new Coordinate(0, 0);
      resolvedInput.definition = (input as UIInput).definition ?? {};
      return this.input.set(resolvedInput);
    }
    resolvedInput.definition = input;
    resolvedInput.position = new Coordinate(0, 0);
    this.input.set(resolvedInput);
  }

  public static rebuildModuleCards (configuration : ModuleCard[]) : ModuleCard[] {
    const result = [] as ModuleCard[];
    for(const config of configuration) {
      // if((config as ModuleCard).position === undefined) {
      //   (config as ModuleCard).position = new Coordinate(Math.random() * 1414, Math.random() * 577);
      // } else {
      //   const position = (config as ModuleCard).position;
      //   (config as ModuleCard).position = new Coordinate(position.x, position.y);
      // }
      // result.push(config as ModuleCard);
    }
    return result;
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
      storedDefinition: { input: {}, output: {} },
      moduleName: module.moduleName,
      key: module.key,
      moduleType: module.moduleType,
      modulePackage: module.modulePackage,
    });
  }

  public serialized () : SerializedBop {
    console.log('--------------------', get(this.configuration));

    return ({
      configuration: get(this.configuration).map((module) => module.serialize()),
      input: get(this.input),
      id: get(this.id),
      constants: get(this.constants),
      variables: get(this.variables),
      name: get(this.name),
      description: get(this.description),
      output: get(this.output),
      customObjects: get(this.customObjects),
      isStarred: get(this.isStarred),
      isLocked: get(this.isLocked),
    });
  }

  public exported () : object {
    return ({
      name: get(this.name),
      description: get(this.description),
      input: get(this.input).definition,
      output: get(this.output),
      constants: get(this.constants),
      variables: get(this.variables),
      configuration: get(this.configuration),
      customObjects: get(this.customObjects),
    });
  }

  private keepStorageUpdated () : void {
    this.configuration.subscribe(saveConfigurations);
    this.input.subscribe(saveConfigurations);
    this.id.subscribe(saveConfigurations);
    this.constants.subscribe(saveConfigurations);
    this.variables.subscribe(saveConfigurations);
    this.name.subscribe(saveConfigurations);
    this.description.subscribe(saveConfigurations);
    this.output.subscribe(saveConfigurations);
    this.customObjects.subscribe(saveConfigurations);
    this.isStarred.subscribe(saveConfigurations);
    this.isLocked.subscribe(saveConfigurations);
  }
}
