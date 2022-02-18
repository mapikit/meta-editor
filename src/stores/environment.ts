import { writable } from "svelte/store";

export const environment = writable({
  scale: 1,
  distributionColumn: 0.4,
})