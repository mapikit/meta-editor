import { Coordinate } from "../../common/types/geometry";
import { get, writable } from "svelte/store";

export interface DragElement<T = unknown> {
  type : string;
  element : HTMLElement;
  data ?: T;
}

export class ArchitectContext {
  public currentMode = writable("default");
  public storeVisible = writable(false);
  public selectedStore = writable("internal");
  public storeModalOpen = writable(false);
  public storeModalContent = writable("");
  public mouseOverStore = writable(false);
  public mouseOverDraggable = writable(false);
  public mousePos = writable({ x:0, y:0 });
  public originPos = writable(new Coordinate(0, 0));
  public scale = writable(1);

  public modulesLayer = writable<HTMLElement>(undefined);
  public overlayLayer = writable<HTMLElement>(undefined);

  // Dragging Data -> Only one cursor - only one element can be dragged :)
  public dragging = writable(false);
  public draggingElement = writable<DragElement>(undefined);
  public mouseOverModule = writable<DragElement>(undefined);

  public get isCutting () : boolean {
    return get(this.currentMode) === "cutting";
  }

  public get isPanning () : boolean {
    return get(this.currentMode) === "panning";
  }
};
