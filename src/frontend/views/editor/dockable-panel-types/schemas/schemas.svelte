<script lang="ts">
  import CardButton from "../../../../components/buttons/card-button.svelte";
  import { SystemConfiguration } from "../../../../../entities/models/system-configuration";
  import { PanelsStore } from "../../../../../entities/stores/panels-store";
  import { PlusSquare } from "phosphor-svelte";

  export let content : PanelsStore<{identifier : string, value : SystemConfiguration["schemas"] }>;

  let systemData = content.entityPanelData;

  $: {
    console.log($systemData.value);
  }
</script>

<div class="flex flex-col items-center w-full h-full pt-0 {$systemData.value.length === 0 ? "justify-center": ""}">
  {#if $systemData.value.length === 0}
  <CardButton hoverColor="green" class= "mt-2 px-2.5 py-1"
    clickFunction={() => { console.log("should add"); }} >
      Add New Schema <PlusSquare class="ml-2"/>
    </CardButton>
  {:else}
    {#each $systemData.value as schema }
      <p> {schema.name} </p>
    {/each}
    <div class="w-full p-1">
      Add +
    </div>
  {/if}
  <section class="absolute bottom-0 mb-2 w-[calc(100%_-_1rem)] mx-2 text-offWhite
  h-fit px-0.5 py-1 text-xs whitespace-nowrap overflow-ellipsis overflow-hidden border-t border-t-1 border-norbalt-200">
    Total Schema Count: {$systemData.value.length} | Addon Schemas: 0 (TODO) | Your Schemas: {$systemData.value.length}
  </section>
</div>
