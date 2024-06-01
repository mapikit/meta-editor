<script lang="ts">
	import { setContext } from "svelte";
	import { exported } from "../../../entities/stores/dock-subdivision-store";
	import DockingSubdivision from "./docking-subdivision.svelte";
	import DraggedDockedView from "./dragged-docked-panel.svelte";
	import { DockCursorMutations } from "../../../entities/mutations/dock-cursor-mutations";
	import dockCursor from "../../../entities/stores/dock-cursor-store";

  // This is the "main" file that should hold the main subdivision
  // --------------
  // ATTENTION:
  // Detached views are not docking areas themselves

  // Creates context for dragging areas around
  const dockContext = setContext("dockContext", dockCursor);

  const mainSubdivision = exported.mainSubdivisionStore;
  let refElement : HTMLElement;
  let { dragging, draggingElement } = dockContext;

  $: {
    if (refElement) mainSubdivision.setElement(refElement);
  }

</script>

<main class="p-2 h-full w-full overflow-hidden">
  <DockingSubdivision subdivision={mainSubdivision}/>
</main>

{ #if $dragging && $draggingElement.type === "docked_view"}
  <DraggedDockedView />
{/if }

<svelte:body on:mouseup={DockCursorMutations.handleUncaughtMouseUp}/>
