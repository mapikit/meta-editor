
import { writable } from "svelte/store";

export interface DragElement<T = unknown> {
  type : string;
  element : HTMLElement;
  data ?: T;
  dropArea ?: boolean;
}

/** Base class used to implement drag'n'drop functionality.
 * Extend it to use it as a context to the Draggable/Drop-area Components.
 */
export class DeafultDragContext {
  // Dragging Data -> Only one cursor - only one element can be dragged :)
  public dragging = writable(false);
  public draggingElement = writable<DragElement | undefined>(undefined);
  public mouseOverElement = writable<DragElement | undefined>(undefined);
}
