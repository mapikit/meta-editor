<script lang="ts">
  import type { ObjectDefinition, TypeDefinition } from "@meta-system/object-definition";
import CancelIcon from "../common/icons/cancel-icon.svelte";
import RightArrow from "../common/icons/right-arrow.svelte";
import DefinitionField from "./definition-field.svelte";
  import { EditorLevel, EditorLevels } from "./obj-def-editor-types-and-helpers";

  // Default mode is Creating an Obj Definition
  export let level : EditorLevel = new EditorLevel(EditorLevels.createAndSignDefinition);
  export let isTopLevel : boolean = true;
  export let initialDefinition : ObjectDefinition = {};

  let definitionData : {
    keyName: string;
    value: unknown;
    type: TypeDefinition["type"];
    required : boolean }[] = [
      {
        keyName: `Initial Test Prop`,
        value: "sum data lol",
        type: "string",
        required: false
      }
    ];
  const data = {};

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
  }

  const updateName = (data : CustomEvent<{ oldKey: string, newKey: string }>) => {
    definitionData.find((value) => value.keyName === data.detail.oldKey)
      .keyName = data.detail.newKey;

    definitionData = definitionData;
  }

  const updateProp = (data : CustomEvent<{key : string; value ?: unknown; type ?: string; required ?: boolean}>) => {
    const property = definitionData.find((value) => value.keyName === data.detail.key)
    
    console.log(data.detail)

    if (data.detail.value) {
      property.value = data.detail.value;
    }

    if (data.detail.type) {
      property.type = data.detail.type;
    }

    if (data.detail.required) {
      property.required = data.detail.required;
    }

    definitionData = definitionData;
  }

  const deleteProp = (propName : string) => {
    const index = definitionData.findIndex((value) => value.keyName === propName);
    definitionData.splice(index, 1);
    definitionData = definitionData;
  }

</script>

<div class="editor-container">
  <div class="properties-holder">
  {#each definitionData as defKey}
    {#if level.canAddProperty()}
      <div class="exclude" on:click="{() => {deleteProp(defKey.keyName)}}">
        <CancelIcon iconColor="#ffffff"/>
      </div>
    {/if}
    <DefinitionField
      on:nameUpdate="{updateName}"
      on:updateProp="{updateProp}"
      initialPropName="{defKey.keyName}"
      initialData="{defKey.value}"
      propType="{defKey.type}"
      propRequired="{defKey.required}"
      level="{level}"
    />
    {#if defKey.type === "object" || defKey.type === "array"}
      <div class="see-obj" > <RightArrow iconColor="white"/> </div>
    {/if}
  {/each}
  </div>
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
