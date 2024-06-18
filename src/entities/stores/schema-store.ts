import { ObjectDefinition } from "@meta-system/object-definition";
import { Writable, get, writable } from "svelte/store";
import { Schema } from "../models/schema";
import { StoreEntityModel } from "../models/store-model";


export class SchemaStore implements StoreEntityModel<Schema> {
  public readonly name : Writable<string> = writable("");
  public readonly format : Writable<ObjectDefinition> = writable({});
  public readonly identifier : string;

  public constructor (parameter : Schema) {
    this.name.set(parameter.name);
    this.format.set(parameter.format);
    this.identifier = parameter.identifier;
  }

  public toEntity () : Schema {
    return new Schema({
      identifier: this.identifier,
      name: get(this.name),
      format: get(this.format),
    });
  }
}
