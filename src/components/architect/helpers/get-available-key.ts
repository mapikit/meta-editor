import type { BopsConfigurationEntry } from "meta-system/dist/src/configuration/business-operations/business-operations-type";

export function getAvailableKey (config : BopsConfigurationEntry[]) : number {
  let key = 1;
  while(config.find(module => module.key === key) !== undefined) key++;
  return key;
}
