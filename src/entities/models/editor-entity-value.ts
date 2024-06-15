import clone from "just-clone";
import { EntityValue } from "meta-system/dist/src/entities/meta-entity";
import { nanoid } from "nanoid";

export type EditorEntityValueConcrete<T extends EntityValue> = new (param : T) => EditorEntityValue<T> & T;

export abstract class EditorEntityValue<T extends EntityValue = { identifier : string }> {
  public readonly identifier : string = nanoid();

  public constructor (parameter : T) {
    Object.entries(parameter).forEach((entry) => {
      if (entry[1]) {
        this[entry[0]] = typeof entry[1] === "object" ? clone(entry[1]) : entry[1];
      }
    });
  }

}
