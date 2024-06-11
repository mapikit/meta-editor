import { TypedKeys } from "../../../common/types/typed-keys";
import { EditorEntityValue } from "../editor-entity-value";

export type DockPanelType = "Addon Configure" | "Addons Browse" | "Addons Timeline"
| "Addons" | "BOps Flow" | "Business Operations" | "Modules Store" | "Overview"
| "Schema Details" | "Configure Schema" | "Schemas" | "Environment Variables";

export class DockPanelContent<T extends EditorEntityValue> {
  public readonly panelType : DockPanelType;
  public readonly entityPanelData : T;
  public readonly type : DockPanelType;
  public readonly key : TypedKeys<T, string>;
  private ommitKeyInTitle : boolean;

  public constructor (key : TypedKeys<T, string>, type : DockPanelType, entityData ?: T) {
    this.entityPanelData = entityData;
    this.key = key;
    this.type = type;

    if (key === "identifier") {
      this.ommitKeyInTitle = true;
    }
  }

  public get title () : string {
    if (this.ommitKeyInTitle) return String(this.type);

    return `${this.type}: ${this.entityPanelData[this.key]}`;
  }
}
