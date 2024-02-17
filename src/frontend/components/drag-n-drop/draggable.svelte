<script lang="ts">
  import { getContext } from "svelte";
	import { DeafultDragContext, DragElement } from "./default-drag-context";
	import { Coordinate } from "../../../entities/models/geometry";

  export let style = "w-full h-full";
  export let dragElement : HTMLElement;
  export let dragType : string;
  export let dragData : object = undefined;
  export let useContext : string;
  export let minimumDragDistance : number = 0;

  // Do drag threshold logic, so the element does not flick when clicking

  let dragInitialPosition = Coordinate.nullable();

  const context = getContext<DeafultDragContext>(useContext);
  let { mouseOverElement, dragging, draggingElement } = context;

  const getCurrentElementDraggablePayload = () : DragElement => ({
    element: dragElement,
    type: dragType,
    data: dragData,
  });

  const updateMouseOverElement = (value : boolean) : void => {
    const payload = value ? getCurrentElementDraggablePayload() : undefined;
    mouseOverElement.set(payload);
  };

  const startDragging = (event : MouseEvent) : void => {
    dragInitialPosition.x = event.x;
    dragInitialPosition.y = event.y;

    event.stopPropagation();
    if (event.button !== 0) { return; }
    if (minimumDragDistance !== 0) { return; }
    dragging.set(true);
    draggingElement.set(getCurrentElementDraggablePayload());
  };

  const stopDragging = (event : MouseEvent) : void => {
    if (event.button !== 0) { return; }

    dragging.set(false);
    draggingElement.set(undefined);
    dragInitialPosition = Coordinate.nullable();
  };

  const computeDistance = (ev : MouseEvent) : void => {
    if (dragInitialPosition.isNullable() || minimumDragDistance === 0) { return; }

    const distance = dragInitialPosition.getDistanceTo(new Coordinate(ev.x, ev.y));
    if (distance >= minimumDragDistance) {
      dragging.set(true);
      draggingElement.set(getCurrentElementDraggablePayload());
      dragInitialPosition = Coordinate.nullable();
    }
  };

  const leaveUnderDistanceThreshold = () : void => {
    if (dragInitialPosition.isNullable() || minimumDragDistance === 0) { return; }

    dragging.set(true);
    draggingElement.set(getCurrentElementDraggablePayload());
    dragInitialPosition = Coordinate.nullable();
  };

  $: draggingHomeStyle = $dragging
    && (($draggingElement).element === dragElement)
    && (($draggingElement).data === dragData) ? "opacity-25" : "opacity-100";
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- There is no go-to option for this kind of element :( -->
<div class="{style} {draggingHomeStyle} transition-opacity"
  on:mouseenter={() => { updateMouseOverElement(true); }}
  on:mouseleave={() => { updateMouseOverElement(false); leaveUnderDistanceThreshold(); }}
  on:mousedown={startDragging}
  on:mouseup={stopDragging}
  on:mousemove={computeDistance}
>
  <slot></slot>
</div>
