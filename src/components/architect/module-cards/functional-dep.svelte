<script lang="ts">
  import type { ModuleCard, UICompliantDependency } from "src/common/types/module-card";
  import type { ArchitectContext } from "src/entities/auxiliary-entities/architect-context";
  import type { UIBusinessOperation } from "src/entities/business-operation";
  import CrossIcon from "../../../icons/cross-icon.svelte";
  import { getContext, onDestroy, onMount } from "svelte";
  import type { CanvasUtils } from "../canvas-utils";
  import Draggable from "../draggable.svelte";
  import { ConnectionPointVertex, VertexType } from "../helpers/connection-vertex";
  import { connectionsManager } from "../helpers/connections-manager";
  import ConnectionPointDragTraces from "./connection-point-drag-traces.svelte";
  import ChevronIcon from "../../../icons/chevron-icon.svelte";

  const moduleConfig = getContext<ModuleCard>("moduleConfig");
  const currentBop = getContext<UIBusinessOperation>("currentBop");
  const canvasUtils = getContext<CanvasUtils>("canvasContext");
  const architectContext = getContext<ArchitectContext>("architectContext");
  
  export let dependency : UICompliantDependency | undefined = undefined;
  export let amount : number = undefined;
  export let current : number = undefined;

  const { configuration } = currentBop;
  const { dependencies } = moduleConfig;
  const { dragging, draggingElement } = architectContext;

  let draggableElement : HTMLElement;
  let draggableConnectionVertex : ConnectionPointVertex;

  // eslint-disable-next-line max-lines-per-function
  const solveConnectionVertex = (
    path : string,
    element : HTMLElement,
    type : VertexType,
  // eslint-disable-next-line max-params
  ) : ConnectionPointVertex => {
    const moduleKey = moduleConfig.getBopTransformedKey();
    const skipManager = path === "-1";

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
    draggableConnectionVertex = solveConnectionVertex(
      dependency !== undefined ? dependency.origin.toString() : (-1).toString(),
      draggableElement,
      "functionalTarget",
    );
  });

  onDestroy(() => {
    draggableConnectionVertex.element = undefined;
    connectionsManager.refreshConnections($configuration);
    canvasUtils.redrawConnections();
  });

</script>
<div class="text-xs mt-1.5 ">
  {#if !dependency}
    <Draggable dragElement={draggableElement} dragType={"functional"} dragData={draggableConnectionVertex}
      style="flex flex-row flex-nowrap justify-start items-center border rounded border-norbalt-100 rounded w-full px-1 py-0.5 h-4 stroke-offWhite hover:stroke-white"
    >
      <div bind:this={draggableElement} class="flex min-w-[1.5rem] w-full justify-center">
        <CrossIcon style="stroke-inherit transition-all rotate-45 w-1.5 h-1.5"/>
      </div>
    </Draggable>
  {:else}
    <div class="flex flex-row flex-nowrap justify-start items-center">
      <div class="bg-norbalt-300 rounded w-full flex flex-row flex-nowrap justify-start items-center px-1 py-0.5 h-5">
        <div bind:this={draggableElement} class="flex flex-col w-2 mr-2 justify-center items-center">
          <div class="bg-norbalt-100 h-0.5 w-full rounded" />
          <div class="bg-norbalt-100 h-0.5 w-full rounded mt-0.5" />
        </div>
        <div class="text-center whitespace-nowrap">
          {currentBop.getModuleByKey(dependency.origin).moduleName}
        </div>
      </div>
      <div class="rounded stroke-offWhite hover:stroke-white ml-1 h-3 w-4 flex justify-center items-center cursor-pointer bg-transparent hover:bg-norbalt-100">
        <ChevronIcon style="stroke-inherit transition-all rotate-0 w-1.5 h-1.5 mt-0.5" />
      </div>
      <div class="rounded stroke-offWhite hover:stroke-white ml-1 h-3 w-4 flex justify-center items-center cursor-pointer bg-transparent hover:bg-norbalt-100">
        <ChevronIcon style="stroke-inherit transition-all rotate-180 w-1.5 h-1.5" />
      </div>
    </div>
  {/if}
</div>

{#if $dragging && (($draggingElement).element === draggableElement)}
  <ConnectionPointDragTraces originVertex={draggableConnectionVertex}/>
{/if}