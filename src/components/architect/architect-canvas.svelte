<script lang="ts">
  import { environment } from "../../stores/environment";
  import { onMount, getContext, onDestroy } from "svelte";
  import { connectionsManager } from "./helpers/connections-manager";
  import { get } from "svelte/store";
  import type { UIBusinessOperation } from "../../entities/business-operation";
  import { updateTraces } from "./update-traces";
  
  let canvas : HTMLCanvasElement;
  const currentBop = getContext<UIBusinessOperation>("currentBop");
  export let context : CanvasRenderingContext2D;
  let sizeObserver : ResizeObserver;

  export function adjustCanvas () : void {
    const containerDimensions = canvas.parentElement.getBoundingClientRect();
    canvas.width = containerDimensions.width;
    canvas.height = containerDimensions.height;
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;

    updateTraces();

    context.lineWidth = 2;
  }

  onMount(() => {
    context = canvas.getContext("2d");
    $environment.canvasContext = context;
    $environment.canvasOffset = canvas.getBoundingClientRect();

    $environment.origin.moveTo(canvas.width/2, canvas.height/2);
    connectionsManager.refreshConnections(get(currentBop.configuration));

    currentBop.configuration.subscribe(() => {
      updateTraces();
    });

    sizeObserver = new ResizeObserver(adjustCanvas);
    sizeObserver.observe(canvas.parentElement);

    environment.subscribe(() => setTimeout(() => updateTraces(), 1));
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