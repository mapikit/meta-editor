import { nanoid } from "nanoid";
import { EditorEntityValue, EditorEntityValueConcrete } from "./editor-entity-value";
import { EnvironmentVariableEntity } from "meta-system/dist/src/entities/system-context";

export class EnvironmentVariable extends
  (EditorEntityValue<EnvironmentVariableEntity> as EditorEntityValueConcrete<EnvironmentVariableEntity>) {
  public static newEmpty () : EnvironmentVariable {
    return new EnvironmentVariable({ key: "new Key", value: "a Value", identifier: nanoid() });
  }
}
