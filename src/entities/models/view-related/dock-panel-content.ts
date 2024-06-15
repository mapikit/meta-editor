import { get } from "svelte/store";
import { TypedKeys } from "../../../common/types/typed-keys";
import { EditorEntityValue } from "../editor-entity-value";
import { StoreEntityModel } from "../store-model";

export type DockPanelType = "Addon Configure" | "Addons Browse" | "Addons Timeline"
| "Addons" | "BOps Flow" | "Business Operations" | "Modules Store" | "Overview"
| "Schema Details" | "Configure Schema" | "Schemas" | "Environment Variables";

export class DockPanelContent<T extends EditorEntityValue, P extends StoreEntityModel<T>> {
  public readonly panelType : DockPanelType;
  public readonly entityPanelData : P;
  public readonly type : DockPanelType;
  public readonly key : TypedKeys<P, string>;
  public readonly titleKey : string = null;

  public constructor (type : DockPanelType, entityData ?: P, titleKey ?: string) {
    this.entityPanelData = entityData;
    this.type = type;
    this.titleKey = titleKey;
  }

  public get title () : string {
    if (!this.titleKey) return String(this.type);

    let entityTitle = this.entityPanelData[this.titleKey];
    if (entityTitle["subscribe"] !== undefined) entityTitle = get(entityTitle);
    return `${this.type}: ${entityTitle}`;
  }
}
