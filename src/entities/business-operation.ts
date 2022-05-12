import { isObjectDefinition, ObjectDefinition } from "@meta-system/object-definition";
import type {
  BopsConfigurationEntry,
  BopsConstant,
  BopsVariable,
  BopsCustomObject } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import type { ModuleCard } from "../common/types/module-card";
import type { UIInput } from "../common/types/ui-input";
import { writable, Writable, readable, Readable } from "svelte/store";


type BOpConstructorArgument = {
  id : string,
  name : string,
  description : string,
  input : UIInput | ObjectDefinition,
  output : ObjectDefinition,
  configuration : ModuleCard[] | BopsConfigurationEntry[],
  constants : BopsConstant[],
  variables : BopsVariable[],
  customObjects : BopsCustomObject[],
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

  constructor ({
    id, name, description, input, output, configuration, constants, customObjects, variables,
  } : BOpConstructorArgument) {
    this.id = readable(id);
    this.name = writable(name);
    this.description = writable(description);
    this.output = writable(output);
    this.constants = writable(constants);
    this.variables = writable(variables);
    this.customObjects = writable(customObjects);

    this.validateInput(input);
    this.validateAllConfigsForUI(configuration);
  }

  private validateInput (input : UIInput | ObjectDefinition) : asserts input is UIInput {
    const resolvedInput : UIInput = { definition: undefined, position: undefined };
    try { isObjectDefinition(input); }
    catch {
      resolvedInput.position = (input as UIInput).position ?? { x: 0, y: 0 };
      return this.input.set(resolvedInput);
    }
    resolvedInput.definition = input;
    resolvedInput.position = { x: 0, y: 0 };
    this.input.set(resolvedInput);
  }

  private validateAllConfigsForUI (configs : BopsConfigurationEntry[] | ModuleCard[])
    : asserts configs is ModuleCard[] {
    for(const config of configs) {
      this.validateConfigForUI(config);

      this.configuration.update(bopConfig => {
        bopConfig.push(config);
        return bopConfig;
      });
    }
  }

  private validateConfigForUI (config : BopsConfigurationEntry | ModuleCard) : asserts config is ModuleCard {
    if((config as ModuleCard).position === undefined) {
      (config as ModuleCard).position = {
        x: Math.random() * 1414, // See TODO below
        y: Math.random() * 577,
      };
    }
  }
  // TODO Recursive search separating modules by their node depth in the tree (from output)
  // This would be used to inteligently assign their position (depth => xPos; modulesInSameDepth => yPos (Stack))
  // private getDepthTree (modules : BopsConfigurationEntry[]) : Array<BopsConfigurationEntry[]> {
  //   const depthTree = [];

  //   return depthTree;
  // }

}
