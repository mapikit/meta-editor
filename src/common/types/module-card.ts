import type { FunctionDefinition } from "@meta-system/meta-function-helper";
import type { BopsConfigurationEntry, Dependency } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import type { Coordinate, Dimensions } from "./geometry";

export type UICompliantDependency = Dependency & {
  originNob : HTMLSpanElement;
  targetNob : HTMLSpanElement;
  matchingType : boolean;
}

export interface ModuleCard extends BopsConfigurationEntry {
  position ?: Coordinate;
  dimensions ?: Dimensions;
  info ?: FunctionDefinition;
  dependencies : Array<UICompliantDependency>
}
