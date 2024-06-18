<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import RightArrow from "../common/icons/right-arrow.svelte";
  import { defaultTypesValues } from "./default-types-values";
  import DefinitionField from "./definition-field.svelte";
  import type { DefinitionData } from "./obj-def-converter";
  import { EditorLevel, EditorLevels } from "./obj-def-editor-types-and-helpers";
  import clone from "just-clone";
  import type { Writable } from "svelte/store";
  import ArrowIcon from "../../icons/arrow-icon.svelte";
  import CrossIcon from "../../icons/cross-icon.svelte";

  // Default mode is Creating an Obj Definition
  export let level : EditorLevel = new EditorLevel(EditorLevels.createAndSignDefinition);
  export let definitionData : Writable<DefinitionData>;
  const dispatch = createEventDispatcher();
  let arrayValue = [];
  let type : DefinitionData | string;

  $: {
    arrayValue = $definitionData.value as [];
    type = $definitionData.subtype as DefinitionData;
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

  const getTypeDeep = (inputType : string | DefinitionData) : string => {
    if (typeof inputType === "string") { return inputType; };

    return inputType.type;
  };
</script>

<div class="pb-1">
  <div class="flex justify-center items-center">
    {#if typeof type === "object"}
      {#if level.canAddProperty()}
      <p class="cursor-pointer flex flex-row items-center text-xl stroke-offWhite hover:stroke-white transition-all" on:click="{() => { navigateArrayDefinition(); }}">
        List of Objects <span class="ml-2"> <ArrowIcon style="stroke-inherit h-3 w-3"/> </span></p>
      {:else}
      <p class="flex flex-row items-center text-xl"> List of Objects </p>
      {/if}
    {:else}
      <p class="flex flex-row items-center text-xl"> List of {type} </p>
    {/if}
  </div>
  {#if arrayValue.length === 0}
    <div class="text-offWhite text-center mt-2"> No items in the List </div>
  {:else}
  <div class="mt-2">
    {#each arrayValue as arrayItem, index }
      <div class="grid grid-cols-[calc(100%_-_32px)_32px] w-full mt-2 first:mt-0 px-4">
        <div class="bg-norbalt-200 rounded flex flex-row col-start-1 col-end-1 h-8 items-center w-full">
          <DefinitionField
            propName="{`item ${index + 1}`}"
            bind:propValue="{arrayItem}"
            propType="{getTypeDeep(type)}"
            propSubType={undefined};
            level="{new EditorLevel(EditorLevels.signDefinition)}"
          />
          {#if level.canAddData()}
            <div class="stroke-offWhite hover:stroke-roseRed transition-all pr-2 h-full flex justify-center items-center cursor-pointer" on:click="{() => {deleteProp(index);}}">
              <CrossIcon style="stroke-inherit"/>
            </div>
          {/if}
        </div>
        {#if level.canAddData() && typeof type === "object"}
          <div class="stroke-offWhite hover:stroke-white transition-all flex justify-center items-center cursor-pointer" on:click={() => navigateItemDefinition(index)}> <ArrowIcon style="stroke-inherit w-3 h-3" /> </div>
        {/if}
        {#if level.canAddData() && type === "cloudedObject"}
          <div class="stroke-offWhite hover:stroke-white transition-all flex justify-center items-center cursor-pointer" on:click={() => navigateCloudedItemDefinition(index)}> <ArrowIcon style="stroke-inherit w-3 h-3" /> </div>
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
