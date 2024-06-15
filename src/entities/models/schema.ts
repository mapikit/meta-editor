import { SchemaType } from "meta-system/dist/src/configuration/schemas/schemas-type";
import { nanoid } from "nanoid";
import { EditorEntityValue, EditorEntityValueConcrete } from "./editor-entity-value";

export class Schema extends (EditorEntityValue<SchemaType> as EditorEntityValueConcrete<SchemaType>) {
  public static newEmpty () : Schema {
    return new Schema({ name: "New Schema", format: {}, identifier: nanoid() });
  }
}
