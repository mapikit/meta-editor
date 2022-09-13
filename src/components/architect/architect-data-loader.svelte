<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { navigation } from "../../lib/navigation";
  import { getBopById } from "../../stores/configuration-store";
  import EditionCanvas from "./edition-canvas.svelte";

  let pathParams = navigation.currentPathParamsSubscribable;

  $: currentBopId = $pathParams["bopId"];
  $: currentBop = getBopById(currentBopId);

  let unsub = () : void => { void 0; };
  onDestroy(() => unsub());

  onMount(() => {
    unsub = pathParams.subscribe(() => {
      currentBopId = navigation.currentPathParams["bopId"];
      currentBop = getBopById(currentBopId);
    });
  });

</script>

{#if $currentBop}
  <div class="w-full h-full">
    <EditionCanvas currentBop={$currentBop} />
  </div>
{:else}
  <div>
    We're still loading...
  </div>
{/if}

