import type { TypeDefinition } from "@meta-system/object-definition";
import type { ModuleCard } from "../../../common/types/module-card";

// eslint-disable-next-line max-params
export function getStoredDefinition
(bopModules : ModuleCard[], parentKey : number, fullPath : string, type : "input" | "output")
  : TypeDefinition {
  const parentModule = bopModules.find(mod => mod.key === parentKey);
  if(parentModule.storedDefinition === undefined) parentModule.storedDefinition = { input: {}, output: {} };
  let aux : unknown = parentModule.storedDefinition[type] ?? {};
  const steps = fullPath.split(".");
  for(const step of steps) aux = aux[step] ?? { type: "cloudedObject", subtype: {} };
  return aux as TypeDefinition;
};
