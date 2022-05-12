import type { BusinessOperations } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import type { ModuleCard } from "./module-card";
import type { UIInput } from "./ui-input";

export interface UICompliantBop extends Omit<BusinessOperations, "configuration" | "input"> {
  configuration : ModuleCard[]
  input : UIInput
}
