import { Readable, Writable, derived, get, writable } from "svelte/store";
import { EditorEntityValue } from "../models/editor-entity-value";

export class SelectedGenericStore<T extends EditorEntityValue> {
  public readonly items : Writable<T[]> = writable([]);
  public readonly currentlyOpenItemId : Writable<string> = writable(null);

  public readonly currentlyOpenItems : Readable<T> = derived([this.items, this.currentlyOpenItemId],
    ([items, current]) => {
      if (current === null) { return undefined; }
      return items.find((it) => it.identifier === current);
    });

  public getItemById (itemId : string) : T {
    return get(this.items).find((p) => p.identifier === itemId);
  }

  public hasItem (itemId : string) : boolean {
    return !!get(this.items).find((p) => p.identifier === itemId);
  }
}
