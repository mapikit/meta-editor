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

  let isOverSelf = false;
  let dropEnabled = false;

  const context = getContext<ArchitectContext>("architectContext");
  const { mouseOverModule, draggingElement, dragging } = context;
  const mouseEnter = () : void => {
    mouseOverModule.set({ type: "drop_area", element });
    isOverSelf = true; ;

    const isAccepted = acceptTypes.includes(($draggingElement)?.type);
    if (isAccepted) {
      dropEnabled = true;
    }
  };
  const mouseLeave = () : void => {
    if ($mouseOverModule.element === element) {
      mouseOverModule.set(undefined);
    }

    isOverSelf = false;
    dropEnabled = false;
  };

  const drop = (e : MouseEvent) : void => {
    if (e.button === 1) { return; }

    const isAccepted = acceptTypes.includes(($draggingElement)?.type);
    if (isAccepted) {
      onDropContent($draggingElement);
      dropEnabled = false;
    }

    return;
  };

  $: clickThrough = $dragging ? "" : "pointer-events-none";
  $: debugStyle = debug ? "border border-roseRed" : "";
  $: validOverStyle = dropEnabled && $dragging ? "backdrop-brightness-[2]" : "";
</script>

<div
  on:mouseup={drop}
  on:mouseenter={mouseEnter}
  on:mouseleave={mouseLeave}
  bind:this={element}
  class="bdrop w-full h-full absolute z-15 {style} {debugStyle} {validOverStyle} {clickThrough}"
>

</div>

<style lang="scss">
.bdrop {
  transition: backdrop-filter 200ms;
}
</style>