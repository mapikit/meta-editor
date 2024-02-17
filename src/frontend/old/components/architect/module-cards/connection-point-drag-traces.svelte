<script lang="ts">
  import type { ArchitectContext } from "../../../entities/auxiliary-entities/architect-context";
  import { getContext, onDestroy, onMount } from "svelte";
  import type { ConnectionPointVertex } from "../helpers/connection-vertex";
  import type { CanvasUtils } from "../canvas-utils";

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  export let onGenerate = () : void => {};
  export let originVertex : ConnectionPointVertex;
  
  const context = getContext<ArchitectContext>("architectContext");
  const canvasContext = getContext<CanvasUtils>("canvasContext");
  const { mousePos } = context;
  let hasBooted = false;

  onMount(() => {
    hasBooted = true;
    onGenerate();
  });

  $: prop = $mousePos && canvasContext.redrawConnections(hasBooted ?
    // eslint-disable-next-line max-len
    [{ startCoords: originVertex.coordinates, endCoords: { x: $mousePos.x, y:$mousePos.y }, strokeStyle: { dash: [8, 2, 4, 2], stroke: "#4086f7" } }]
    : undefined);

  onDestroy(() => {
    canvasContext.redrawConnections();
  });
</script>
