<script lang="ts">
	import Draggable from "../../components/drag-n-drop/draggable.svelte";
	import { SubdivisionStore } from "../../../entities/stores/dock-subdivision-store";
	import DockViewContent from "./dockable-panel-types/docked-panel-content.svelte";
  import PanelHeader from "./dockable-panel-types/panel-header.svelte";

  // This is the holder for views in dock.

  export let parent : SubdivisionStore;
  export let currentElement : SubdivisionStore;
  let draggedView : HTMLElement;

  let { view } = currentElement;

</script>

<div class="relative rounded-lg overflow-hidden bg-panel-gradient w-full h-full select-none shadow-contrast
  flex flex-col"
  bind:this={draggedView}
>
  <Draggable
    dragType="docked_view"
    dragElement={draggedView}
    useContext="dockContext"
    style="w-full h-9"
    dragData={currentElement}
    minimumDragDistance={3}
  >
    <PanelHeader parent={parent} currentElement={currentElement}/>
  </Draggable>
  <section class="flex-1 w-full p-2 pt-0 h-full flex flex-col justify-center items-center">
    <DockViewContent viewContent={$view}/>
  </section>
</div>
