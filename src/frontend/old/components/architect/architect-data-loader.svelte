<script lang="ts">
  import { onDestroy, onMount, setContext } from "svelte";
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

  setContext("currentBop", currentBop);

</script>

{#if $currentBop}
  {#key currentBopId}
    <div class="w-full h-full">
      <EditionCanvas currentBop={$currentBop} />
    </div>
  {/key}
{:else}
  <div>
    We're still loading...
  </div>
{/if}

