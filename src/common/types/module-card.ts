import type { BopsConfigurationEntry, Dependency } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import type { Coordinate, Dimensions } from "./geometry";

export type UICompliantDependency = Dependency & {
  matchingType : boolean;
}


export interface ModuleCard extends BopsConfigurationEntry {
  position ?: Coordinate;
  dimensions ?: Dimensions;
  bopId ?: string;
  dependencies : Array<UICompliantDependency>;
}
