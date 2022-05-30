import { writable } from "svelte/store";

export const selectedSystem = writable("");

selectedSystem.subscribe((val) => {
  console.log("Selected system value changed to ", val);
});
