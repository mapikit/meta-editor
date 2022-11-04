import { writable } from "svelte/store";

export class ArchitectContext {
  public storeVisible = writable(false);
  public selectedStore = writable("constants");
  public storeModalOpen = writable(false);
  public storeModalContent = writable("");
  public mouseOverStore = writable(false);
  public mouseOverModule = writable(undefined);
  public mousePos = writable({ x:0, y:0 });

  public modulesLayer = writable<HTMLElement>(undefined);
  public overlayLayer = writable<HTMLElement>(undefined);

  // Dragging Data -> Only one cursor - only one element can be dragged :)
  public dragging = writable(false);
  public draggingElement = writable(undefined);
};
