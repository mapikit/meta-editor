<script lang="ts">
  import type { FunctionDefinition } from "@meta-system/meta-function-helper";
  import type { ModuleType } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import type { Writable } from "svelte/store";
  import type { ModuleCard } from "../../../common/types/module-card";
  import DropdownIcon from "./dropdown-icon.svelte";
  import StoreModule from "./module-components/store-module.svelte";
  import type { StoreModuleInfo } from "../../../common/types/store-module-info";
import ChevronIcon from "../../../icons/chevron-icon.svelte";

  export let sectionModulesType : ModuleType;
  export let summary : string;
  export let modulesInSection : Array<StoreModuleInfo>;
  export let search : string = "";
  export let storeLocked = false;
  export let bopModules : Writable<ModuleCard[]>;

  let searchDelay : NodeJS.Timeout;
  let searchedModules : Array<StoreModuleInfo> = modulesInSection;
  let open  = false;
  // $: searchInSection(search);

  // async function searchInSection (searchString : string) : Promise<void> {
  //   if(searchDelay !== undefined) clearTimeout(searchDelay);
  //   searchDelay = setTimeout(() => {
  //     const result = modulesInSection.filter(module =>
  //       module.functionName.toLowerCase().includes(searchString.toLowerCase()),
  //     );
  //     searchedModules = result;
  //     open = searchedModules.length > 0 && searchString !== "";
  //     searchDelay = undefined;
  //   }, 300);
  // }

  $: openChevronRotation = open ? "" : "-rotate-90";
</script>


<div class="w-full flex flex-col mt-1 first:mt-0">
  <div class="w-full flex flex-row items-center cursor-pointer stroke-offWhite hover:stroke-white transition-all text-offWhite hover:text-white"
    on:click="{() => open = !open }"
  >
    <ChevronIcon style="stroke-inherit mr-2 w-2 transition-transform {openChevronRotation}"/>
    <span class="mr-2"> {summary} </span>
    <div class="flex-1 h-[1px] bg-norbalt-100"/>
  </div>

  {#if open}
    {#each searchedModules as module}
      <StoreModule bind:bopModules bind:storeLocked module={module} moduleType={sectionModulesType} />
    {/each}
  {/if}
  <!-- <summary><span class="icon"><DropdownIcon/></span>{summary + ` (${searchedModules.length})`}</summary> -->
    <!-- {#if open} -->
      <!-- {#each searchedModules as module} -->
        <!-- <div class="module"><StoreModule bind:bopModules bind:storeLocked module={module} moduleType={sectionModulesType}/></div> -->
      <!-- {/each} -->
    <!-- {/if} -->
</div>
