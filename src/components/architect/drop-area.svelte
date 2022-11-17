<script lang="ts">
  import type { ArchitectContext, DragElement } from "src/entities/auxiliary-entities/architect-context";
  import { getContext } from "svelte";

  let element : HTMLElement;
  export let style = "";
  export let acceptTypes : string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  export let onDropContent : (droppedElement : DragElement) => void =
    (droppedElement : DragElement) : void => {};
  export let debug = false;

  const context = getContext<ArchitectContext>("architectContext");
  const { mouseOverModule, draggingElement } = context;
  const mouseEnter = () : void => {
    mouseOverModule.set({ type: "drop_area", element });
  };
  const mouseLeave = () : void => {
    if ($mouseOverModule.element === element) {
      mouseOverModule.set(undefined);
    }
  };

  const drop = (e : MouseEvent) => {
    if (e.button !== 1) { return; }

    const isAccepted = acceptTypes.includes(($draggingElement).type);

    if (isAccepted) {
      onDropContent($draggingElement);
    }

    return;
  };

  $: debugStyle = debug ? "border border-roseRed" : "";
</script>

<div
  on:mouseup={drop}
  on:mouseenter={mouseEnter}
  on:mouseleave={mouseLeave}
  bind:this={element}
  class="w-full h-full {debugStyle} {style}"
>
  <slot></slot>
</div>