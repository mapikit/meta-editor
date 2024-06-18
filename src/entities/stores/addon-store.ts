import { Writable, get, writable } from "svelte/store";
import { Addon } from "../models/addon";
import { StoreEntityModel } from "../models/store-model";

export class AddonStore implements StoreEntityModel<Addon> {
  public readonly identifier : string;
  public readonly version : Writable<string> = writable("");
  public readonly source : Writable<string> = writable("");
  public readonly collectStrategy : Writable<"npm" | "url" | "file"> = writable("npm");
  public readonly configuration : Writable<unknown> = writable({});

  public constructor (parameter : Addon) {
    this.identifier = parameter.identifier;
    this.version.set(parameter.version);
    this.source.set(parameter.source);
    this.collectStrategy.set(parameter.collectStrategy);
    this.configuration.set(parameter.configuration);
  }

  public toEntity () : Addon {
    return new Addon({
      identifier: this.identifier,
      version: get(this.version),
      source: get(this.source),
      collectStrategy: get(this.collectStrategy),
      configuration: get(this.configuration),
    });
  }
}

