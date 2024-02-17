/* eslint-disable max-classes-per-file */
import { Writable, writable } from "svelte/store";
import { EditorEntityValue } from "src/entities/models/editor-entity-value";
import { DockViewContent, DockViewType } from "../models/dock-view-content";

export class ViewStore<T extends EditorEntityValue> {
  public readonly viewType : Writable<DockViewType> = writable(null);
  public entityViewData : Writable<T> = writable<T>(null);
  public readonly typeHistory : Writable<DockViewContent<T>[]> = writable([]);

  public readonly title : Writable<string> = writable(null);

  public constructor (viewTitle : string, entityData ?: T) {
    this.entityViewData.set(entityData);

    this.title.set(viewTitle);
  }
}

class AvailableViews {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly allAvailableViews : Writable<DockViewContent<any>[]> = writable([]);
}

export const availableViews = new AvailableViews();
