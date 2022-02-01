import type { FunctionDefinition } from "@meta-system/meta-function-helper";
import type { BopsConfigurationEntry } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import type { Coordinate } from "./geometry";

export interface ModuleCard extends BopsConfigurationEntry {
  position ?: Coordinate;
  info ?: FunctionDefinition;
}