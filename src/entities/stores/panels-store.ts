/* eslint-disable max-classes-per-file */
import { Writable, writable } from "svelte/store";
import { EditorEntityValue } from "src/entities/models/editor-entity-value";
import { DockPanelContent, DockPanelType } from "../models/view-related/dock-panel-content";

export class PanelsStore<T extends EditorEntityValue> {
  public readonly panelType : Writable<DockPanelType> = writable(null);
  public entityPanelData : Writable<T> = writable<T>(null);
  public readonly typeHistory : Writable<DockPanelContent<T>[]> = writable([]);

  public readonly title : Writable<string> = writable(null);

  public constructor (panelTitle : string, entityData : T) {
    this.entityPanelData.set(entityData);

    this.title.set(panelTitle);
  }
}

class AvailablePanels {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly allAvailablePanels : Writable<DockPanelContent<any>[]> = writable([]);
}

export const availablePanels = new AvailablePanels();
