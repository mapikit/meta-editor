import type { TransitionConfig } from "svelte/types/runtime/transition";
import { sineInOut } from "svelte/easing";

type ExpandOptions = {
  duration ?: number;
  initial ?: number;
}

export function expand (node : HTMLElement, { duration = 200, initial = 0 } : ExpandOptions) : TransitionConfig {
  return {
    duration,
    css: t => {
      const easing = sineInOut(t);
      return `
        width: ${initial + (100-initial)*easing}%;
        overflow: hidden;
      `;
    },
  };
}
