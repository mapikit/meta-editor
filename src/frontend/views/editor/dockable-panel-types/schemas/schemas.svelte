<script lang="ts">
  import CardButton from "../../../../components/buttons/card-button.svelte";
  import { PanelsStore } from "../../../../../entities/stores/panels-store";
  import { CaretDown, PlusSquare } from "phosphor-svelte";
  import { SystemConfigurationMutations } from "../../../../../entities/mutations/system-configuration-mutations";
  import { SystemConfigurationStore } from "../../../../../entities/stores/system-configurations-store";
  import { Writable } from "svelte/store";
  import { Schema } from "../../../../../entities/models/schema";

  export let content : PanelsStore<{identifier : string, value : SystemConfigurationStore["schemas"] }>;

  let systemData = content.entityPanelData;
  let currentData : Writable<Schema[]>;

  $: {
    currentData = $systemData.value;
  }

</script>

{#if currentData}
<div class="flex flex-col items-center w-full h-full pt-0 {$currentData.length === 0 ? "justify-center": ""}">
  {#if $currentData.length === 0}
  <CardButton hoverColor="green" class= "mt-2 px-2.5 py-1"
  clickFunction={() => { SystemConfigurationMutations.addNewEmptySchema(); }} >
    Add New Schema <PlusSquare class="ml-2"/>
  </CardButton>
  {:else}
  <div class="overflow-y-scroll w-full mb-16 pb-1 -mr-1 pr-1 h-[calc(100%_-_2rem)">
  {#each $currentData as schema }
    <div class="bg-norbalt-400 w-full rounded py-1.5 px-2.5 mt-2 first:mt-0">
      <div class="flex items-center">
        <CaretDown class="mr-1.5 text-offWhite font-black hover:text-white" />
        <p> {schema.name} </p>
      </div>
    </div>
  {/each}
  <CardButton hoverColor="default" class= "mt-4 px-2.5 py-1 ml-0.5 w-[calc(100%_-_4px)]"
  clickFunction={() => { SystemConfigurationMutations.addNewEmptySchema(); }} >
    Add New Schema <PlusSquare class="ml-2"/>
  </CardButton>
  </div>
  {/if}
  <section class="absolute bottom-0 mb-2 w-[calc(100%_-_1rem)] mx-2 text-offWhite
  h-fit px-0.5 pt-1 text-xs whitespace-nowrap overflow-ellipsis
  overflow-hidden border-t border-t-1 border-norbalt-200">
    <div class="flex justify-start items-start">
      <p class="overflow-hidden text-ellipsis"> Total Schema Count: {$currentData.length} </p>
      <div class="bg-norbalt-200 mx-2 min-w-[1px] h-5 -mt-1" />
      <p class="overflow-hidden text-ellipsis"> Your Schemas: {$currentData.length} </p>
      <div class="bg-norbalt-200 mx-2 min-w-[1px] h-5 -mt-1" />
      <p class="overflow-hidden text-ellipsis"> Addon Schemas: 0 (TODO) </p>
    </div>
  </section>
</div>
{/if}
