<script lang="ts">
  import { getContext } from "svelte";
	import { DeafultDragContext, DragElement } from "./default-drag-context";

  let element : HTMLElement;
  export let style = "";
  export let cssStyle = "";
  export let acceptTypes : string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  export let onDropContent : (droppedElement : DragElement) => void =
    (droppedElement : DragElement) : void => {};
  export let onAcceptedDragOver : (draggedElement : DragElement) => void = () : void => {};
  export let onAcceptedDragOut : () => void = () : void => {};
  export let debug = false;
  export let isActive = true;
  export let useContext : string;
  export let overrideStyle = false;
  export let shouldHighlight = true;

  let baseStyle = "bdrop w-full z-15 h-full absolute";
  let isOverSelf = false;
  let dropEnabled = false;

  const context = getContext<DeafultDragContext>(useContext);
  const { mouseOverElement, draggingElement, dragging } = context;
  const mouseEnter = () : void => {
    if (!isActive) return;
    mouseOverElement.set({ type: "drop_area", element });
    isOverSelf = true;

    if (isAccepted) {
      onAcceptedDragOver($draggingElement);
      dropEnabled = true;
    }
  };
  const mouseLeave = () : void => {
    onAcceptedDragOut();
    if (!isActive) return;
    if ($mouseOverElement.element === element) {
      mouseOverElement.set(undefined);
    }

    isOverSelf = false;
    dropEnabled = false;
  };

  const drop = (e : MouseEvent) : void => {
    if (e.button === 1) { return; }

    if (isAccepted) {
      onDropContent($draggingElement);
      dropEnabled = false;
    }

    return;
  };

  $: isAccepted = $draggingElement && acceptTypes.includes(($draggingElement)?.type);
  $: clickThrough = $dragging && isAccepted ? "" : "pointer-events-none";
  $: debugStyle = debug ? "border border-roseRed" : "";
  $: validOverStyle = shouldHighlight && dropEnabled
    && $dragging ? $$slots.default ? "brightness-[1.5]" : "backdrop-brightness-[1.8]" : "";
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- There is no go-to option for this kind of element :( -->
<section
  on:mouseup={drop}
  on:mouseenter={mouseEnter}
  on:mouseleave={mouseLeave}
  bind:this={element}
  class="transition-all duration-150 {overrideStyle ? "" : baseStyle} {style} {debugStyle} {validOverStyle} {clickThrough}"
  style="{cssStyle}"
>
<slot>
</slot>
</section>

<style lang="scss">
.bdrop {
  transition: backdrop-filter 200ms;
}
</style>
