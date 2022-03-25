import { writable } from "svelte/store"

export type NobSelection = {
  nobType : "input" | "output";
  propertyType : string;
  property : string;
  nob: HTMLSpanElement;
  parentKey : number;
}

export const selectedNob = writable<NobSelection>();
