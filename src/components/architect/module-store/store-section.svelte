<script lang="ts">
  import type { FunctionDefinition } from "@meta-system/meta-function-helper";
  import StoreModule from "./store-module.svelte";

  export let summary : string;
  export let modulesInSection : Array<FunctionDefinition>
  export let search : string = "";

  let searchDelay : NodeJS.Timeout;
  let searchedModules : Array<FunctionDefinition> = modulesInSection;
  let open : boolean = false;
  $: searchInSection(search);

  async function searchInSection (searchString : string) : Promise<void> {
    if(searchDelay !== undefined) clearTimeout(searchDelay);
    searchDelay = setTimeout(() => {
      const result = modulesInSection.filter(module => module.functionName.includes(searchString))
      searchedModules = result;
      open = searchedModules.length > 0 && searchString !== ""
      searchDelay = undefined;
    }, 300);
  }
</script>


<details class="section" bind:open>
  <summary>{summary + ` (${searchedModules.length})`}</summary>
  {#if open}
    {#each searchedModules as module}
      <div class="module"><StoreModule definition={module}/></div>
    {/each}
  {/if}
</details>

<style lang="scss">
  .section {
    cursor: default;
    user-select: none;
    padding: 5px 0 5px 0;
    margin: 3px 0 3px 0;
    justify-self: center;
    background-color: gray;
    border-radius: 7px;
    display: flex;
    justify-items: center;
  }

  .module {
    width: 100%;
  }
</style>

