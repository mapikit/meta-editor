<script lang="ts">
	import Draggable from "../../components/drag-n-drop/draggable.svelte";
  import DropdownViewSelector from "./dropdown-panel-selector.svelte";
  import { DockMutations } from "../../../entities/mutations/dock-mutations";
	import { SubdivisionStore } from "../../../entities/stores/dock-subdivision-store";
	import DockViewContent from "./dockable-panel-types/docked-panel-content.svelte";

  // This is the holder for views in dock.
  // This contains the logic for changing the view type

  export let parent : SubdivisionStore;
  export let currentElement : SubdivisionStore;
  let draggedView : HTMLElement;

  let id;
  let { ratio, dimension, view } = currentElement;
  let title;

  $: {
    id = currentElement?._id;
    title = $view.title;
  }
</script>

<div class="relative rounded-lg overflow-hidden bg-gradient-to-tr from-norbalt-300 to-norbalt-400 w-full h-full select-none shadow-contrast"
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
    <header class="w-full h-9 px-1 py-1 flex flex-row items-center">
      <!-- Selects the view Type -->
      <span class="text-offWhite whitespace-nowrap"> {$title} </span>
      <button class="ml-2" on:click={() => { DockMutations.divide(parent, id); }} >
        {"[+]"}
      </button>
      
      <button class="ml-2" on:click={() => { DockMutations.exclude(parent, id); }} >
        {"[delete]"}
      </button>
      <div class="flex flex-row justify-end flex-1">
        <DropdownViewSelector selectedView={$view}/>
      </div>
    </header>
  </Draggable>
  <section class="flex-1 w-full p-2 h-full flex flex-col justify-center items-center">
    <DockViewContent viewContent={$view}/>
  </section>
</div>
