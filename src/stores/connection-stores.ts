import { writable } from "svelte/store"
import type { Coordinate } from "../common/types/geometry"
import type { ModuleCard } from "../common/types/module-card"

export type NobSelection = {
  type : "input" | "output";
  property : string;
  nob: HTMLSpanElement;
  parentCard : ModuleCard;
}

export const selectedNob = writable<NobSelection>()

export type ModuleConnection = {
  start : Coordinate;
  end: Coordinate;
}

// TODO use an actual store for this (should impact the updateTraces function)
// IMPORTANT! Suggestion: in bop followThisStructure:
// {
//   ...BOPInfo
//   configuration: [
//     {
//       ...MODULEINFO
//       dependencies: [
//         origin: <key>, 
//         originPath: <string>, 
//         targetPath: <string>,
//         originNob: <HTMLSpanElement>,
//         thisNob: <HTMLSpanElement>,
//       ]
//     }
//   ]
// }
// This should allow for simply deleting a dependency to remove the connections
// Also allows for the BOp Update to impact on connection updates
export const moduleConnections : Record<string, [HTMLSpanElement, HTMLSpanElement]> = {};
