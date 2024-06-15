import { StoreEntityModel } from "../models/store-model";
import { Writable, get, writable } from "svelte/store";
import { EnvironmentVariable } from "../models/environment-variable";

export class EnvironmentVariableStore implements StoreEntityModel<EnvironmentVariable> {
  public readonly identifier : string;
  public readonly key : Writable<string> = writable("");
  public readonly value : Writable<string> = writable("");

  public constructor (parameter : EnvironmentVariable) {
    this.identifier = parameter.identifier;
    this.key.set(parameter.key);
    this.value.set(parameter.value);
  }

  public toEntity () : EnvironmentVariable {
    return {
      identifier: this.identifier,
      key: get(this.key),
      value: get(this.value),
    };
  }
}
