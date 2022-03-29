<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import CancelIcon from "../common/icons/cancel-icon.svelte";
  import StringField from "./editing-fields/string-field.svelte";
  import { EditorLevel, EditorLevels } from "./obj-def-editor-types-and-helpers";

  // Default mode is Creating an Obj Definition
  export let level : EditorLevel = new EditorLevel(EditorLevels.createAndSignDefinition);
  export let definitionData : string[] = [];
  const dispatch = createEventDispatcher();

  const addEnumOption = () => {
    let newPropNumber = definitionData.length;

    definitionData.push(`Enum Option (${newPropNumber + 1})`);

    definitionData = definitionData;
    dispatch("sync-value");
  }

  const deleteProp = (optionValue : string) => {
    const index = definitionData.findIndex((value) => value === optionValue);
    definitionData.splice(index, 1);
    definitionData = definitionData;

    dispatch("sync-value");
  }

</script>

<div class="editor-container">
  {#if definitionData.length === 0}
    <p class="no-options"> No options in ENUM </p>
  {/if}
  {#each definitionData as optionName}
  <div class="properties-holder">
    {#if level.canAddProperty()}
      <div class="exclude" on:click="{() => {deleteProp(optionName)}}">
        <CancelIcon iconColor="#ffffff"/>
      </div>
    {/if}
    <div class="field-holder">
      <StringField bind:propValue={optionName} standalone updateFunction={() => { dispatch("sync-value") }}/>
    </div>
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
