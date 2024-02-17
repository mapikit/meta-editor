<script lang="ts">
	import { DockMutations } from "../../../entities/mutations/dock-mutations";
	import { SubdivisionStore } from "../../../entities/stores/dock-subdivision-store";
	import DockingDropArea from "./docking-drop-area.svelte";

  // Is the area between children. It is not rendered before the first, nor after the last
  // Its responsabilities is handling redimensioning docking subdivisions


  export let mode : "tall" | "wide" = "tall";
  export let beforeId : string;
  export let afterId : string;
  export let parent : SubdivisionStore;

  let moving = false;
  let delta = 0;
  let lastValue = 0;

  const moveFunc = (ev : MouseEvent) : void => {
    if (!moving) { return; }
    const value = mode === "tall" ? ev.clientX : ev.clientY;
    // const direction = mode === "tall" ? ev.movementX : ev.movementY;

    delta = (value - lastValue);

    DockMutations.resize(parent, beforeId, afterId, delta);
    lastValue = mode === "tall" ? ev.clientX : ev.clientY;
  };

  let modeCursor = mode === "tall" ? "cursor-col-resize" : "cursor-row-resize";
  let size;

  $: {
    size = mode === "tall" ? "w-1.5 h-full" : "h-1.5 w-full";
  }

  const onDrop = (dragged : SubdivisionStore) : void => {
    DockMutations.dropBetween(dragged, { previousId: beforeId, afterId });
  };
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- There is no go-to option for this kind of element :( -->


<div
  class="relative z-10 overflow-visible bg-norbalt-500
    {modeCursor} {size} transition-all duration-100 flex justify-center items-center select-none"
  role="separator"
  on:mousedown={(ev) => {
    moving = true;
    lastValue = mode === "tall" ? ev.clientX : ev.clientY;
  }}
  on:mouseup={() => { moving = false; }}
>
  <DockingDropArea
    position="{mode === "tall" ? "vertical" : "horizontal"}"
    parent={parent}
    onDrop={onDrop}
  />
</div>

<svelte:body on:mouseup={() => { moving = false; }} on:mousemove={moveFunc}
/>
