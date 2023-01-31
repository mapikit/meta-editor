<script lang="ts">
  import { onMount, getContext, onDestroy } from "svelte";
  import { connectionsManager } from "./helpers/connections-manager";
  import { get } from "svelte/store";
  import type { UIBusinessOperation } from "../../entities/business-operation";
  import type { CanvasUtils } from "./canvas-utils";
  
  let canvas : HTMLCanvasElement;
  const currentBop = getContext<UIBusinessOperation>("currentBop");
  const canvasUtils = getContext<CanvasUtils>("canvasContext");
  let sizeObserver : ResizeObserver;

  export function adjustCanvas () : void {
    const containerDimensions = canvas.parentElement.getBoundingClientRect();
    canvas.width = containerDimensions.width;
    canvas.height = containerDimensions.height;

    canvasUtils.redrawConnections();
  }

  $: origin = canvasUtils.origin;
  $: scale = canvasUtils.scale;

  onMount(() => {
    canvasUtils.canvasContext = canvas.getContext("2d");

    origin.set($origin.moveTo(canvas.width/2, canvas.height/2));
    connectionsManager.refreshConnections(get(currentBop.configuration));

    currentBop.configuration.subscribe(() => {
      canvasUtils.redrawConnections();
    });

    sizeObserver = new ResizeObserver(adjustCanvas);
    sizeObserver.observe(canvas.parentElement);

    scale.subscribe(() => setTimeout(() => canvasUtils.redrawConnections(), 1));
    origin.subscribe(() => setTimeout(() => canvasUtils.redrawConnections(), 1));
    // Investigate and avoid this kind of repetition & timeout
    // Timeout Only: traces have "springness" (modules don't)
    // No Timeout: traces don't update correctly (obvious with scaling)

    adjustCanvas();
  });

  onDestroy(() => {
    sizeObserver.disconnect();
  });
</script>

<canvas class="absolute top-0 left-0 w-full h-full" bind:this={canvas}/>