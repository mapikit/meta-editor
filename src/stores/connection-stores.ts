import { writable } from "svelte/store"
import type { ModuleCard } from "../common/types/module-card"

export type NobSelection = {
  nobType : "input" | "output";
  propertyType : string;
  property : string;
  nob: HTMLSpanElement;
  parentCard : ModuleCard;
}

export const selectedNob = writable<NobSelection>()
