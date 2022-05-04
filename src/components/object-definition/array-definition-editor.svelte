<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import CancelIcon from "../common/icons/cancel-icon.svelte";
  import RightArrow from "../common/icons/right-arrow.svelte";
  import { defaultTypesValues } from "./default-types-values";
  import DefinitionField from "./definition-field.svelte";
  import type { DefinitionData } from "./obj-def-converter";
  import { EditorLevel, EditorLevels } from "./obj-def-editor-types-and-helpers";
  import clone from "just-clone";

  // Default mode is Creating an Obj Definition
  export let level : EditorLevel = new EditorLevel(EditorLevels.createAndSignDefinition);
  export let definitionData : DefinitionData;
  const dispatch = createEventDispatcher();
  let arrayValue = [];
  let type : DefinitionData | string;

  $: {
    arrayValue = definitionData.value as [];
    type = definitionData.subtype as DefinitionData;
  }

  const deleteProp = (index) => {
    arrayValue.splice(index, 1);
    arrayValue = arrayValue;
  };

  const navigateArrayDefinition = () => {
    dispatch("navigate-definition", { path: "subtype", levelOverride: EditorLevels.createDefinition });
  };

  const navigateItemDefinition = (index : number) => {
    dispatch("navigate-definition", { path: `value.${index}`, levelOverride: EditorLevels.signDefinition });
  };

  const navigateCloudedItemDefinition = (index : number) => {
    dispatch("navigate-definition", { path: `value.${index}`, levelOverride: EditorLevels.createAndSignDefinition });
  };

  // eslint-disable-next-line max-lines-per-function
  const addNewArrayItem = () => {
    if (typeof type === "object" || type === "cloudedObject") {
      let subtype : any = [];
      if ((type as DefinitionData).subtype) {
        subtype = clone((type as DefinitionData).subtype as object);
      }
      arrayValue.push({
        subtype, // is the array type (already DefinitionData),
        keyName: "Object in Array",
        type: "object",
        value: {},
        required: true,
      });
      arrayValue = arrayValue;
      return;
    }

    arrayValue.push(defaultTypesValues[type]);
    arrayValue = arrayValue;
  };
</script>

<div class="editor-container">
  <div class="array-type">
    {#if typeof type === "object"}
      <p class="clickable" on:click="{() => { navigateArrayDefinition(); }}"> List of Objects
        <span> <RightArrow iconColor="white"/> </span></p>
    {:else}
      List of {type}
    {/if}
  </div>
  {#if arrayValue.length === 0}
    <div class="no-options"> No items in the List </div>
  {:else}
  <div class="list-container">
    {#each arrayValue as arrayItem, index }
      <div class="properties-holder">
        {#if level.canAddData()}
          <div class="exclude" on:click="{() => {deleteProp(index);}}">
            <CancelIcon iconColor="#ffffff"/>
          </div>
        {/if}
        <DefinitionField
          propName="{`item ${index + 1}`}"
          bind:propValue="{arrayItem}"
          propType="{type}"
          level="{new EditorLevel(EditorLevels.signDefinition)}"
        />
        {#if level.canAddData() && typeof type === "object"}
          <div class="see-obj" on:click={() => navigateItemDefinition(index)}> <RightArrow iconColor="white"/> </div>
        {/if}
        {#if level.canAddData() && type === "cloudedObject"}
          <div class="see-obj" on:click={() => navigateCloudedItemDefinition(index)}> <RightArrow iconColor="white"/> </div>
        {/if}
      </div>
    {/each}
  </div>
  {/if}
  {#if level.canAddData()}
    <div class="add-prop" on:click={() => {addNewArrayItem();} }> Add new item </div>
  {/if}
</div>

<style lang="scss">
  .editor-container {
    font-family: 'Dosis';
    font-size: 16px;
    display: flex;
    flex-flow: column nowrap;
  }

  .clickable {
    cursor: pointer;
  }

  .list-container {
    margin-top: 8px;
  }

  .array-type {
    text-align: center;
    font-size: 20px;
    padding-bottom: 8px;
    margin: 0 26px;
    // border-bottom: solid 1px #ffffffb4;
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

    &>.see-obj {
      width: 22px;
      height: 22px;
      cursor: pointer;

      align-self: center;
      justify-self: center;
      display: flex;
      justify-content: center;
      align-content: center;
      grid-column-start: 3;
    }
  }

  .no-options {
    text-align: center;
    color: #545474;
  }

  .add-prop {
    margin: 16px 16px 8px 16px;
    width: auto;
    text-align: center;
    cursor: pointer;
    border-radius: 6px;
    padding: 4px 6px;
    background-color: #13131f;
  }
</style>
