import type { ModuleCard } from "../../../common/types/module-card";

export function getAvailableKey (config : ModuleCard[]) : number {
  let key = 1;
  while(config.find(module => module.key === key) !== undefined) key++;
  return key;
}
