<script lang="ts">
  import type { ObjectDefinition } from "@meta-system/object-definition";
  import { createEventDispatcher } from "svelte";
  import CancelIcon from "../common/icons/cancel-icon.svelte";
  import RightArrow from "../common/icons/right-arrow.svelte";
  import DefinitionField from "./definition-field.svelte";
  import type { DefinitionData } from "./obj-def-converter";
  import { EditorLevel, EditorLevels } from "./obj-def-editor-types-and-helpers";

  // Default mode is Creating an Obj Definition
  export let level : EditorLevel = new EditorLevel(EditorLevels.createAndSignDefinition);
  export let definitionData : DefinitionData[] = [];
  const dispatch = createEventDispatcher();

  const appendData = () => {
    let newPropNumber = 1;

    while (definitionData.find((value) => value.keyName === `new prop (${newPropNumber})`) !== undefined) {
      newPropNumber ++;
    }

    definitionData.push({
      keyName: `new prop (${newPropNumber})`,
      value: "",
      type: "string",
      required: false
    });

    definitionData = definitionData;
    dispatch("sync-value");
  }

  const updateName = (data : CustomEvent<{ oldKey: string, newKey: string }>) => {
    console.log("trying to update:::: ", data.detail);
    definitionData.find((value) => value.keyName === data.detail.oldKey)
      .keyName = data.detail.newKey;

    definitionData = definitionData;
  }

  const syncProp = (data : CustomEvent<{key : string; value : unknown; type : string; required : boolean; subtype : unknown}>) => {
    const property = definitionData.find((value) => value.keyName === data.detail.key)

    property.value = data.detail.value;
    property.type = data.detail.type;
    property.subtype = data.detail.subtype;
    property.required = data.detail.required;
    
    definitionData = definitionData;
  }

  const deleteProp = (propName : string) => {
    const index = definitionData.findIndex((value) => value.keyName === propName);
    definitionData.splice(index, 1);
    definitionData = definitionData;
  }

  const navigateDefinition = (definition : DefinitionData, index : number) => {
    dispatch("navigate-definition", { definition, index });
  }
</script>

<div class="editor-container">
  {#each definitionData as defKey, index}
  <div class="properties-holder">
    {#if level.canAddProperty()}
      <div class="exclude" on:click="{() => {deleteProp(defKey.keyName)}}">
        <CancelIcon iconColor="#ffffff"/>
      </div>
    {/if}
    <DefinitionField
      on:nameUpdate="{updateName}"
      on:syncProp="{syncProp}"
      propName="{defKey.keyName}"
      initialPropName="{defKey.keyName}"
      propValue="{defKey.value}"
      propType="{defKey.type}"
      propRequired="{defKey.required}"
      level="{level}"
    />
    {#if defKey.type === "object" || defKey.type === "array"}
      <div class="see-obj" on:click={() => navigateDefinition(defKey, index)}> <RightArrow iconColor="white"/> </div>
    {/if}
  </div>
  {/each}
  {#if level.canAddProperty()}
    <div class="add-prop" on:click="{appendData}">
      add property
    </div>
  {/if}
</div>

<style lang="scss">
  .editor-container {
    font-family: 'Dosis';
    font-size: 16px;
    display: flex;
    flex-flow: column nowrap;
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

      align-self: center;
      justify-self: center;
      display: flex;
      justify-content: center;
      align-content: center;
      grid-column-start: 3;
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
