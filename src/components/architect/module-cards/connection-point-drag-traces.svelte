<script lang="ts">
  import type { ArchitectContext } from "../../../entities/auxiliary-entities/architect-context";
  import { getContext, onDestroy, onMount } from "svelte";
  import { updateTraces } from "../update-traces";
  import type { ConnectionPointVertex } from "../helpers/connection-vertex";

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  export let onGenerate = () : void => {};
  export let originVertex : ConnectionPointVertex;
  
  const context = getContext<ArchitectContext>("architectContext");
  const { mousePos } = context;
  let hasBooted = false;

  onMount(() => {
    hasBooted = true;
    onGenerate();
  });

  $: prop = $mousePos && updateTraces(hasBooted ?
    // eslint-disable-next-line max-len
    [{ startCoords: originVertex.coordinates, endCoords: { x: $mousePos.x, y:$mousePos.y }, strokeStyle: { dash: [8, 2, 4, 2], stroke: "#4086f7" } }]
    : undefined);

  onDestroy(() => {
    updateTraces();
  });
</script>
