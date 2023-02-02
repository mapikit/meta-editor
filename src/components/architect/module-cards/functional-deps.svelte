<script lang="ts">
  import type { ModuleCard } from "src/common/types/module-card";
  import type { ArchitectContext } from "src/entities/auxiliary-entities/architect-context";
  import type { UIBusinessOperation } from "src/entities/business-operation";
  import { getContext, onMount } from "svelte";
  import type { CanvasUtils } from "../canvas-utils";
  import Draggable from "../draggable.svelte";
  import { ConnectionPointVertex, VertexType } from "../helpers/connection-vertex";
  import { connectionsManager } from "../helpers/connections-manager";
  import ConnectionPointDragTraces from "./connection-point-drag-traces.svelte";

  const moduleConfig = getContext<ModuleCard>("moduleConfig");
  const currentBop = getContext<UIBusinessOperation>("currentBop");
  const canvasUtils = getContext<CanvasUtils>("canvasContext");
  const architectContext = getContext<ArchitectContext>("architectContext");

  const { configuration } = currentBop;
  const { dependencies } = moduleConfig;
  const { dragging, draggingElement } = architectContext;

  let draggableElement : HTMLElement;
  let draggableConnectionVertex : ConnectionPointVertex;
  export let rootConnectionVertex : ConnectionPointVertex;

  $: functionalDeps = $dependencies && moduleConfig.getFunctionalDependencies();

  // eslint-disable-next-line max-lines-per-function
  const solveConnectionVertex = (
    path : string,
    element : HTMLElement,
    type : VertexType,
    skipManager = false,
  // eslint-disable-next-line max-params
  ) : ConnectionPointVertex => {
    const moduleKey = moduleConfig.getBopTransformedKey();

    let result = !skipManager ? connectionsManager
      .getVertex(ConnectionPointVertex.generateId(type, moduleKey, path)) : undefined;

    if (result === undefined) {
      result = ConnectionPointVertex
        .buildNew("function", path, moduleKey, type, element);

      if (!skipManager) { connectionsManager.registerVertex(result); }
    }

    result.element = element;
    connectionsManager.refreshConnections($configuration);
    canvasUtils.redrawConnections();

    return result;
  };

  onMount(() => {
    draggableConnectionVertex = solveConnectionVertex("", draggableElement, "functionalTarget", true);
  });

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
    <Draggable dragElement={draggableElement} dragType={"functional"} dragData={rootConnectionVertex}>
      <div bind:this={draggableElement}> Drag me </div>
    </Draggable>
  {/if}
</div>

{#if $dragging && (($draggingElement).element === draggableElement)}
  <ConnectionPointDragTraces originVertex={draggableConnectionVertex}/>
{/if}