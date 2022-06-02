import type { Writable } from "svelte/store";

export type PropertyListEntry = {
  id : string;
  name : Writable<string>;
  locked : Writable<boolean>;
  starred : Writable<boolean>;
  description : Writable<string>;
  dataValues : Array<{ name : string; value : Writable<unknown>, editable ?: boolean }>
  deleteSelf : () => void;
};
