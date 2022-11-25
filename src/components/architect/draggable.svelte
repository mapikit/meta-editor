<script lang="ts">
  import type { ArchitectContext } from "../../entities/auxiliary-entities/architect-context";
  import { getContext } from "svelte";

  const context = getContext<ArchitectContext>("architectContext");
  let { mouseOverDraggable, dragging, draggingElement } = context;

  export let style = "w-full h-full";
  export let dragElement : HTMLElement;
  export let dragType : string;
  export let dragData : object = undefined;

  const updateMouseOverDraggable = (value : boolean) : void => {
    mouseOverDraggable.set(value);
  };

  const startDragging = (event : MouseEvent) : void => {
    if (event.button !== 0) { return; }
    dragging.set(true);
    draggingElement.set({ type: dragType, element: dragElement, data: dragData });
  };

  const stopDragging = (event : MouseEvent) : void => {
    if (event.button !== 0) { return; }

    dragging.set(false);
    draggingElement.set({});
  };

  $: draggingHomeStyle = $dragging && (($draggingElement).element === dragElement) ? "opacity-25" : "opacity-100";
</script>

<div class="{style} {draggingHomeStyle} transition-opacity"
  on:mouseenter={() => { updateMouseOverDraggable(true); }}
  on:mouseleave={() => { updateMouseOverDraggable(false); }}
  on:mousedown={startDragging}
  on:mouseup={stopDragging}
>
  <slot></slot>
</div>
