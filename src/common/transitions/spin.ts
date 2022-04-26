import type { TransitionConfig } from "svelte/types/runtime/transition";
import { cubicInOut } from "svelte/easing";

type ExpandOptions = {
  duration ?: number;
  turns ?: number;
  initial ?: number;
}

export function spin (node : HTMLElement, { duration = 400, turns = 1, initial = 0 } : ExpandOptions) : TransitionConfig {
  return {
    duration,
    css: t => {
      const easing = cubicInOut(t);
      return `
        transform: rotate(${initial + (360 * turns)*easing}deg);
      `;
    },
  };
}
