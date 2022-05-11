import type { ObjectDefinition } from "@meta-system/object-definition";
import type { BopsConfigurationEntry, BopsConstant, BopsVariable } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import type { ModuleCard } from "../common/types/module-card";
import type { UICompliantBop } from "../common/types/ui-bop";
import type { UIInput } from "../common/types/ui-input";

export class BusinessOperation implements UICompliantBop {
  public readonly constants : BopsConstant[] = [];
  public readonly variables : BopsVariable[] = [];
  public readonly configuration : ModuleCard[] = [];

  constructor (
    public readonly id : string,
    public name : string,
    public description: string,
    public input : UIInput,
    public output : ObjectDefinition,
    public customObjects : any,
  ) {}

  public addModule (module : BopsConfigurationEntry | ModuleCard) {
    const newModule : ModuleCard = {
    }
  }
}