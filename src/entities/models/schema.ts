import { ObjectDefinition } from "@meta-system/object-definition";
import { SchemaType } from "meta-system/dist/src/configuration/schemas/schemas-type";
import { nanoid } from "nanoid";

export class Schema implements SchemaType {
  public name : string = "New Schema";
  public format : ObjectDefinition = {};
  public readonly identifier : string = nanoid();

  public constructor (parameters : Partial<SchemaType>) {
    this.name = parameters.name ?? this.name;
    this.format = parameters.format ?? this.format;
    this.identifier = parameters.identifier ?? this.identifier;
  }

  public static newEmpty () : Schema {
    return new Schema({});
  }
}
