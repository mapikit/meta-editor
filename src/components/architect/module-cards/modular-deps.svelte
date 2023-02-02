<script lang="ts">
  import ConnectionPoint from "./connection-point.svelte";

  export let outputValues : string[] = [];
</script>

<div class="absolute left-[calc(100%_+_0.5rem)] top-0 bg-norbalt-200 pl-2 pr-1 py-1 rounded shadow text-sm">
  {#each outputValues as key} 
    <div class="flex flex-row w-[100%] justify-end items-center mt-1 first:mt-0 text-sm">
      <p class="text-xs"> {key} </p>
      <ConnectionPoint mode="module" parentPaths={[key]}/>
    </div>
  {/each}
</div>