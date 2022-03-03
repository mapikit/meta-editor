import { writable } from "svelte/store";
import type { UICompliantBop } from "../common/types/ui-bop";

// eslint-disable-next-line prefer-const
export let bopStore = writable<UICompliantBop>({} as UICompliantBop);
