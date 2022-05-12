import { writable } from "svelte/store";

export const selectedSystem = writable("");

selectedSystem.subscribe((value) => {
  console.log(`%c Bruh i was changed to ${value}`, "{ color: red }");
});
