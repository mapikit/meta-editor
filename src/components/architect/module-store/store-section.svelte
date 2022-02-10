<script lang="ts">
  import type { FunctionDefinition } from "@meta-system/meta-function-helper";
  import DropdownIcon from "./dropdown-icon.svelte";
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
      const result = modulesInSection.filter(module =>
        module.functionName.toLowerCase().includes(searchString.toLowerCase())
      )
      searchedModules = result;
      open = searchedModules.length > 0 && searchString !== ""
      searchDelay = undefined;
    }, 300);
  }
</script>


<details class="section" bind:open>
  <summary><span class="icon"><DropdownIcon/></span>{summary + ` (${searchedModules.length})`}</summary>
    {#if open}
      {#each searchedModules as module}
        <div class="module"><StoreModule definition={module}/></div>
      {/each}
    {/if}
</details>

<style lang="scss">
  summary {
    position: relative;
    cursor: default;
    user-select: none;
    background-color: #191928;
    padding: 6px 0 6px 0;
    margin: 3px 0 3px 0;
    border-radius: 5px;
    list-style: none;
    transition: all 1s;
    width: 100%;
  }

  .icon {
    width: 18px;
    height: 18px;
    align-self: center;
    left: 5px;
    position: absolute;
    transform-origin: center;
    transition: all 200ms ease-in-out;
    stroke: white;
  }

  .section {
    border-radius: 7px;
    display: flex;
    width: 100%;
    overflow: hidden;
  
    &[open] {
      margin-bottom: 10px;
    }

    &[open] > summary > .icon {
      transform: rotate(90deg);
    }

    &[open] > summary ~ * {
      animation: grow 450ms;
    }
  }

  @keyframes grow {
    0% { width: 0%; opacity: 0; }
    20% { width: 20%; opacity: 0; }
    100% { width: 100%; opacity: 1; }
  }
</style>

