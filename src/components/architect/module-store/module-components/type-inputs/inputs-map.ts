import type { SvelteComponent } from "svelte";

import BooleanInput from "./boolean-input.svelte";
import DateInput from "./date-input.svelte";
import NumberInput from "./number-input.svelte";
import StringInput from "./string-input.svelte";
import ObjectInput from "./object-input.svelte";
import ArrayInput from "./array-input.svelte";

import { typeColors } from "../../../../../common/styles/type-colors";


export const availableComponents : Record<string, typeof SvelteComponent> = {
  "string": StringInput,
  "number": NumberInput,
  "date": DateInput,
  "boolean": BooleanInput,
  "object": ObjectInput,
  "array": ArrayInput,
}

export const possibleConstTypes = Object.keys(typeColors).filter(type => 
  type !== "cloudedObject" &&
  type !== "any" &&
  type !== "function"
);
