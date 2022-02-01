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
export const moduleConnections : Record<string, [HTMLSpanElement, HTMLSpanElement]> = {};
