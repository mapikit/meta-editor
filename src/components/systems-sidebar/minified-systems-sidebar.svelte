<script lang="ts">
import { availableProjects } from "../../stores/projects-store";
import { get } from "svelte/store";

import MinifiedSystem from "./minified-system.svelte";
let systems = [];

$: systems = $availableProjects;
</script>

<div class="text-md font-sans text-white w-24 h-full flex flex-row justify-between">
  <div class="flex flex-col items-center w-full h-full">
    <p class="font-bold mt-6"> Projects </p>
    <div class="mt-4 flex flex-col justify-start items-center">
      {#each systems as system}
        <MinifiedSystem systemName={get(system.name)} systemId={get(system.id)}/>
      {/each}
    </div>
  </div>
  <div class="bg-norbalt-100 w-1 rounded h-[calc(100%_-_32px)] self-center"></div>
</div>
