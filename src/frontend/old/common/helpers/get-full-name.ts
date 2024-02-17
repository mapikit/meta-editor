import type { BopsConfigurationEntry } from "meta-system/dist/src/configuration/business-operations/business-operations-type";

export function getFullName (moduleConfig : BopsConfigurationEntry) : string {
  if(moduleConfig.modulePackage !== undefined) {
    return `${moduleConfig.moduleType}.${moduleConfig.modulePackage}.${moduleConfig.moduleName}`;
  } else return `${moduleConfig.moduleType}.${moduleConfig.moduleName}`;
}
