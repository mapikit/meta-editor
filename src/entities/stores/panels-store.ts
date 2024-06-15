/* eslint-disable max-classes-per-file */
import { Writable, writable } from "svelte/store";
import { EditorEntityValue } from "src/entities/models/editor-entity-value";
import { DockPanelContent, DockPanelType } from "../models/view-related/dock-panel-content";
import { StoreEntityModel, newEmptyStoreEntityModel } from "../models/store-model";

export class PanelsStore<T extends EditorEntityValue, P extends StoreEntityModel<T>> {
  public readonly panelType : Writable<DockPanelType> = writable(null);
  public entityPanelData : Writable<P> = writable<P>(null);
  public readonly typeHistory : Writable<DockPanelContent<T,P>[]> = writable([]);

  public readonly title : Writable<string> = writable(null);

  public constructor (panelTitle : string, entityData : P) {
    this.entityPanelData.set(entityData);

    this.title.set(panelTitle);
  }

  public static newEmptyPanelStore () : PanelsStore<EditorEntityValue, StoreEntityModel<EditorEntityValue>> {
    return new PanelsStore("", newEmptyStoreEntityModel());
  }
}

class AvailablePanels {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly allAvailablePanels : Writable<DockPanelContent<any, any>[]> = writable([]);
}

export const availablePanels = new AvailablePanels();
