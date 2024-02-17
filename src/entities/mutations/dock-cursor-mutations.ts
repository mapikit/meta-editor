import { get } from "svelte/store";
import dockCursor from "../stores/dock-cursor-store";

export class DockCursorMutations {
  public static handleUncaughtMouseUp () : void {
    if (DockCursorMutations.isDraggingOverInvalid) {
      dockCursor.dragging.set(false);
      dockCursor.draggingElement.set(undefined);
    }
  }

  public static isDraggingOverInvalid () : boolean {
    return get(dockCursor.dragging) && get(dockCursor.mouseOverElement) === undefined;
  }
}
