/* eslint-disable max-classes-per-file */
import { Writable, writable } from "svelte/store";
import { DefaultEditorEntityValue, EditorEntityValue } from "src/entities/models/editor-entity-value";
import { DockPanelContent, DockPanelType } from "../models/view-related/dock-panel-content";
import { StoreEntityModel } from "../models/store-model";

export class PanelStore<T extends EditorEntityValue = DefaultEditorEntityValue,
  P extends StoreEntityModel<T> = StoreEntityModel<T>> {
  public readonly panelType : Writable<DockPanelType> = writable(null);
  public panelContent : Writable<DockPanelContent<T,P>> = writable<DockPanelContent<T,P>>(null);
  public readonly typeHistory : Writable<DockPanelContent<T,P>[]> = writable([]);

  public readonly title : Writable<string> = writable(null);

  public constructor (panelTitle : string, panelContent : DockPanelContent<T,P>) {
    this.panelContent.set(panelContent);

    this.title.set(panelTitle);
  }

  public static newEmptyPanelStore () : PanelStore<EditorEntityValue, StoreEntityModel<EditorEntityValue>> {
    return new PanelStore("", DockPanelContent.newEmpty());
  }
}

class AvailablePanels {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly allAvailablePanels : Writable<DockPanelContent<any, any>[]> = writable([]);
}

export const availablePanels = new AvailablePanels();
