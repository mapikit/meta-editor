<script lang="ts">
  import type { ArchitectContext } from "../../../entities/auxiliary-entities/architect-context";
  import { getContext, onDestroy, onMount } from "svelte";
  import { updateTraces } from "../update-traces";

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  export let onGenerate = () : void => {};
  
  const context = getContext<ArchitectContext>("architectContext");
  const { mousePos } = context;
  let hasBooted = false;

  onMount(() => {
    hasBooted = true;
    onGenerate();
  });

  $: prop = $mousePos && updateTraces(hasBooted ? { cursor: { x: $mousePos.x, y:$mousePos.y } } : undefined);

  onDestroy(() => {
    updateTraces();
  });
</script>
