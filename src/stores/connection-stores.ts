import { writable } from "svelte/store";

export type NobSelection = {
  nobType : "input" | "output" | "module" | "functional";
  propertyType : string;
  property : string;
  nob : HTMLSpanElement;
  parentKey : number | "input";
}

export const selectedNob = writable<NobSelection>();
