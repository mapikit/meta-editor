import { writable } from "svelte/store";

export type NobSelection = {
  nobType : "input" | "output" | "module";
  propertyType : string;
  property : string;
  nob : HTMLSpanElement;
  parentKey : number | "input";
}

export const selectedNob = writable<NobSelection>();
