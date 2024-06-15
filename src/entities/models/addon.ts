import { Addon as MsysAddon } from "meta-system/dist/src/configuration/addon-type";
import { EditorEntityValue, EditorEntityValueConcrete } from "./editor-entity-value";
import { nanoid } from "nanoid";

export class Addon extends (EditorEntityValue<MsysAddon> as EditorEntityValueConcrete<MsysAddon>) {
  public static newEmpty () : Addon {
    return new Addon({
      collectStrategy: "npm",
      source: "",
      identifier: nanoid(),
      version: "0.0.1",
      configuration: {},
    });
  }
}
