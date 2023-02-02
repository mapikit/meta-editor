<script lang="ts">
  import type { ModuleCard } from "src/common/types/module-card";
  import { getContext } from "svelte";

  const moduleConfig = getContext<ModuleCard>("moduleConfig");
  const { dependencies } = moduleConfig;

  $: functionalDeps = $dependencies && moduleConfig.getFunctionalDependencies();

  // Do a draggable fella, capable of being dragged into another card to connect to them
  // Draggable fella must be a connection vertex
  // We must do a dropArea at the WHOLE module card to drop the fella at
  // Module card's connection vertex of functionalOrigin must be the card name

  // Have a list of orderable items. They have to be cut with scissors to be removed
  // At first, they should be ordered by buttons, later by dragging them
</script>

<div class="absolute right-[calc(100%_+_0.5rem)] top-0 bg-norbalt-200 px-2 py-1 rounded shadow text-sm">
  {#each functionalDeps as dependency} 
    <div class="flex flex-row w-[100%] justify-end items-center mt-1 first:mt-0 text-sm">
      <p class="text-xs"> {dependency.origin} </p>
    </div>
  {/each}
  {#if functionalDeps.length === 0}
    no dependencies here :( <!--  here we will have the draggable fella! -->
  {/if}
</div>