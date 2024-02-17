import { get, writable, Writable } from "svelte/store";
import type { Serialized } from "./serialized-type";
import type { EnvironmentVariable as MetaSystemEnvironmentVariable }
  from "meta-system/dist/src/configuration/configuration-type";

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

  public update (key : string, value : string) : void {
    this.key.set(key);
    this.value.set(value);
  }

  public exportable () : MetaSystemEnvironmentVariable {
    return {
      key: get(this.key),
      value: get(this.value),
    };
  }
}
