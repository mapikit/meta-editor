import type { Writable } from "svelte/store";

export type PropertyListEntry = {
  readonly id : string;
  name : Writable<string>;
  locked : Writable<boolean>;
  starred : Writable<boolean>;
  description : Writable<string>;
  readonly type :  ("Schema" | "BOp" | "Protocol");
  dataValues : Array<{ name : string; value : Writable<unknown>, editable ?: boolean }>
};
