import { get, writable, Writable } from "svelte/store";
import type { Serialized } from "./serialized-type";

export class EnvironmentVariable {
  public readonly key : Writable<string> = writable("");
  public readonly value : Writable<string> = writable("");

  public constructor ({ key, value } : { key : string; value : string }) {
    this.key.set(key);
    this.value.set(value);
  }

  public serialized () : Serialized<EnvironmentVariable> {
    return {
      key: get(this.key),
      value: get(this.value),
    };
  }
}
