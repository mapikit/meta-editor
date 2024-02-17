import { TypedKeys } from "../../common/types/typed-keys";
import { EditorEntityValue } from "./editor-entity-value";

export type DockViewType = "Addon Configure" | "Addons Browse" | "Addons Timeline"
| "Addons" | "BOps Flow" | "Business Operations" | "Modules Store" | "Overview"
| "Schema Details" | "Configure Schema" | "Schemas" | "Environment Variables";

export class DockViewContent<T extends EditorEntityValue> {
  public readonly viewType : DockViewType;
  public readonly entityViewData : T;
  public readonly type : DockViewType;
  private readonly key : TypedKeys<T, string>;
  private ommitKeyInTitle : boolean;

  public constructor (key : TypedKeys<T, string>, type : DockViewType, entityData ?: T) {
    this.entityViewData = entityData;
    this.key = key;
    this.type = type;

    if (key === "identifier") {
      this.ommitKeyInTitle = true;
    }
  }

  public get title () : string {
    if (this.ommitKeyInTitle) return String(this.type);

    return `${this.type}: ${this.entityViewData[this.key]}`;
  }
}
