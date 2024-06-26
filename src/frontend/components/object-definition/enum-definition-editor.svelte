<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Writable } from "svelte/store";
  import StringField from "./editing-fields/string-field.svelte";
  import type { DefinitionData } from "./obj-def-converter";
  import { EditorLevel, EditorLevels } from "./obj-def-editor-types-and-helpers";
  import CancelIcon from "src/frontend/icons/cancel-icon.svelte";

  // Default mode is Creating an Obj Definition
  export let level : EditorLevel = new EditorLevel(EditorLevels.createAndSignDefinition);
  export let definitionData : Writable<DefinitionData>;
  let enumDefinitiondata;

  $: {
    enumDefinitiondata = $definitionData.subtype as string[];
  }

  const dispatch = createEventDispatcher();

  const addEnumOption = () => {
    let newPropNumber = enumDefinitiondata.length;

    enumDefinitiondata.push(`Enum Option (${newPropNumber + 1})`);

    enumDefinitiondata = enumDefinitiondata;
    definitionData.update((current) => {
      return { ...current, subtype: enumDefinitiondata };
    });
    dispatch("sync-value");
  };

  const deleteProp = (optionValue : string) => {
    const index = enumDefinitiondata.findIndex((value) => value === optionValue);
    enumDefinitiondata.splice(index, 1);
    enumDefinitiondata = enumDefinitiondata;
    definitionData.update((current) => {
      return { ...current, subtype: enumDefinitiondata };
    });

    dispatch("sync-value");
  };

</script>

<div class="flex flex-col">
  {#if enumDefinitiondata.length === 0}
    <p class="no-options"> No options in ENUM </p>
  {/if}
  {#each enumDefinitiondata as optionName}
  <div class="properties-holder">
    {#if level.canAddProperty()}
      <div class="exclude" on:click="{() => {deleteProp(optionName);}}">
        <CancelIcon iconColor="#ffffff"/>
      </div>
    {/if}
    {#if level.canAddProperty()}
      <div class="mb-2 col-start-2">
        <StringField bind:propValue={optionName} updateFunction={() => { dispatch("sync-value"); }}/>
      </div>
    {:else}
      <div class="w-full col-start-2 outline-none transition-all h-6 px-2 rounded bg-norbalt-300 border border-norbalt-100 mb-2"> {optionName} </div>
    {/if}
  </div>
  {/each}
  {#if level.canAddProperty()}
    <div class="add-prop" on:click="{addEnumOption}">
      Add Enum option
    </div>
  {/if}
</div>

<style lang="scss">
  .field-holder {
    margin-bottom: 8px;
    grid-column-start: 2;
  }

  .editor-container {
    font-family: 'Dosis';
    font-size: 16px;
    display: flex;
    flex-flow: column nowrap;
  }

  .no-options {
    text-align: center;
    color: #545474;
  }

  .properties-holder {
    width: 100%;
    display: grid;
    grid-template-columns: 26px calc(100% - 52px) 26px;

    &>.exclude {
      align-self: center;
      justify-self: center;
      cursor: pointer;
      width: 22px;
      height: 22px;

      display: flex;
      justify-content: center;
      align-content: center;
      grid-column-start: 1;
    }
  }

  .add-prop {
    margin: 16px 32px 8px 32px;
    width: auto;
    text-align: center;
    cursor: pointer;
    border-radius: 6px;
    padding: 4px 6px;
    background-color: #13131f;
  }
</style>
