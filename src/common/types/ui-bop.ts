import type { BusinessOperations } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import type { ModuleCard } from "./module-card";

export interface UICompliantBop extends Omit<BusinessOperations, "configuration"> {
  configuration : ModuleCard[]
}
