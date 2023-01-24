import { writable } from "svelte/store";

export interface DragElement<T = unknown> {
  type : string;
  element : HTMLElement;
  data ?: T;
}

export class ArchitectContext {
  public storeVisible = writable(false);
  public selectedStore = writable("internal");
  public storeModalOpen = writable(false);
  public storeModalContent = writable("");
  public mouseOverStore = writable(false);
  public mouseOverDraggable = writable(false);
  public mousePos = writable({ x:0, y:0 });

  public modulesLayer = writable<HTMLElement>(undefined);
  public overlayLayer = writable<HTMLElement>(undefined);

  // Dragging Data -> Only one cursor - only one element can be dragged :)
  public dragging = writable(false);
  public draggingElement = writable<DragElement>(undefined);
  public mouseOverModule = writable<DragElement>(undefined);
};
