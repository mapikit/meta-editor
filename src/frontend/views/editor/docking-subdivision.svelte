<script lang="ts">
	import { SubdivisionStore, DropPosition } from "../../../entities/stores/dock-subdivision-store";
	import DockedView from "./docked-view.svelte";
	import DockControlArea from "./dock-control-area.svelte";
	import DockingDropArea from "./docking-drop-area.svelte";
	import { getContext, onDestroy } from "svelte";
	import dockCursor from "../../../entities/stores/dock-cursor-store";
  import { DockMutations } from "../../../entities/mutations/dock-mutations";

  // This is the view responsible for resizing layout parts.
  // Its children MUST be either many (2+) subdivisions, or just **a single** view.

  export let subdivision : SubdivisionStore;

  const dockContext = getContext<typeof dockCursor>("dockContext");

  let children = subdivision.children;
  let subdivisionRatio = subdivision.ratio;
  let direction = subdivision.direction;
  let { dragging, draggingElement } = dockContext;

  let isView;
  let parent = subdivision.parent;
  let { showBottomDropArea, showTopDropArea, showLeftDropArea, showRightDropArea } = subdivision.getDropAreaRules();

  let refElement : HTMLElement;

  $: {
    if (refElement) subdivision.setElement(refElement);

    isView = $children.length === 0;
  }

  const unsub = parent.subscribe(() => {
    let newRules = subdivision.getDropAreaRules();

    showBottomDropArea = newRules.showBottomDropArea;
    showTopDropArea = newRules.showTopDropArea;
    showLeftDropArea = newRules.showLeftDropArea;
    showRightDropArea = newRules.showRightDropArea;
  });

  onDestroy(unsub);

  const onDropPositional = (position : DropPosition) : (dragged : SubdivisionStore) => void => {
    return (dragged : SubdivisionStore) => DockMutations.dropOnPosition(dragged, position, subdivision);
  };
</script>

<div
  class="relative z-0 w-full h-full flex bg-norbalt-500
    rounded-xl transition-[padding] duration-100 min-h-0 min-w-0"
  style="flex: {$subdivisionRatio}; flex-direction:{$direction === "horizontal" ? "row" : "column"}"
  bind:this={refElement}>
  {#if isView}
    <DockedView parent={$parent} currentElement={subdivision}/>
  {:else}
    {#each $children as child, childIndex }
      {#key child._id}
        <svelte:self subdivision={child} />
        {#if childIndex + 1 < $children.length}
          <DockControlArea
            mode={$direction === "horizontal" ? "tall" : "wide"}
            parent={subdivision}
            beforeId={child._id}
            afterId={$children[childIndex + 1]._id}
          />
        {/if}
      {/key}
    {/each}
  {/if}

  <!-- drop areas-->
  {#if $dragging && $draggingElement.type === "docked_view"}
    {#if $showTopDropArea}
      <DockingDropArea position="top" parent={subdivision} onDrop={onDropPositional("top")}/>
    {/if}
    {#if $showBottomDropArea}
      <DockingDropArea position="bottom" parent={subdivision} onDrop={onDropPositional("bottom")}/>
    {/if}
    {#if $showLeftDropArea}
      <DockingDropArea position="left" parent={subdivision} onDrop={onDropPositional("left")}/>
    {/if}
    {#if $showRightDropArea}
      <DockingDropArea position="right" parent={subdivision} onDrop={onDropPositional("right")}/>
    {/if}
  {/if}
</div>
