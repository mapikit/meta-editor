import type { ConfigurationType } from "meta-system";
import { writable } from "svelte/store";

export const systemStore = writable({} as ConfigurationType)