import type { ObjectDefinition } from "@meta-system/object-definition";
import type { Coordinate } from "./geometry";

export type UIInput = {
  definition : ObjectDefinition;
  position ?: Coordinate;
}