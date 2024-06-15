import { BusinessOperationType }
  from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { EditorEntityValue, EditorEntityValueConcrete } from "./editor-entity-value";
import { nanoid } from "nanoid";

export class BusinessOperation
  extends (EditorEntityValue<BusinessOperationType> as EditorEntityValueConcrete<BusinessOperationType>) {
  public static newEmpty () : BusinessOperation {
    return new BusinessOperation({
      identifier: nanoid(),
      configuration: [],
      constants: [],
      variables: [],
      input: {},
      output: {},
    });
  }
}
