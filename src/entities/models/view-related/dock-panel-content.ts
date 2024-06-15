import { get } from "svelte/store";
import { DefaultEditorEntityValue, EditorEntityValue } from "../editor-entity-value";
import { StoreEntityModel, newEmptyStoreEntityModel } from "../store-model";

export type DockPanelType = "Addon Configure" | "Addons Browse" | "Addons Timeline"
| "Addons" | "BOps Flow" | "Business Operations" | "Modules Store" | "Overview"
| "Configure Schema" | "Schemas" | "Environment Variables";

export class DockPanelContent<T extends EditorEntityValue = DefaultEditorEntityValue,
  P extends StoreEntityModel<T> = StoreEntityModel<T>> {
  public readonly entityPanelData : P;
  public readonly type : DockPanelType;
  public readonly identifier : string;
  public readonly titleKey : string = null;

  public constructor (type : DockPanelType, entityData ?: P, titleKey ?: string) {
    this.entityPanelData = entityData;
    this.type = type;
    this.titleKey = titleKey;
    this.identifier = entityData["identifier"];
  }

  public get title () : string {
    if (!this.titleKey) return String(this.type);

    let entityTitle = this.entityPanelData[this.titleKey];
    if (entityTitle["subscribe"] !== undefined) entityTitle = get(entityTitle);
    return `${this.type}: ${entityTitle}`;
  }

  public static newEmpty () : DockPanelContent<EditorEntityValue, StoreEntityModel<EditorEntityValue>> {
    return new DockPanelContent("Overview", newEmptyStoreEntityModel());
  }
}
