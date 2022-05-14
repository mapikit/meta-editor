import type { Readable, Writable } from "svelte/store";

export type PropertyListEntry = {
  id : Readable<string>;
  name : Writable<string>;
  locked : Writable<boolean>;
  starred : Writable<boolean>;
  description : Writable<string>;
  dataValues : Array<{ name : string; value : Writable<unknown>, editable ?: boolean }>
};
