<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import CancelIcon from "../common/icons/cancel-icon.svelte";
  import RightArrow from "../common/icons/right-arrow.svelte";
  import DefinitionField from "./definition-field.svelte";
  import type { DefinitionData } from "./obj-def-converter";
  import { EditorLevel, EditorLevels } from "./obj-def-editor-types-and-helpers";

  // Default mode is Creating an Obj Definition
  export let level : EditorLevel = new EditorLevel(EditorLevels.createAndSignDefinition);
  export let definitionData : DefinitionData;

  let objectDefinitionData;

  $: {
    objectDefinitionData = definitionData.subtype as DefinitionData[];
  }

  const dispatch = createEventDispatcher();

  // eslint-disable-next-line max-lines-per-function
  const appendData = () => {
    let newPropNumber = 1;

    if (objectDefinitionData.length === 0) {
      definitionData.subtype = objectDefinitionData;
    }

    while (objectDefinitionData.find((value) => value.keyName === `new prop (${newPropNumber})`) !== undefined) {
      newPropNumber ++;
    }

    objectDefinitionData.push({
      keyName: `new prop (${newPropNumber})`,
      value: "",
      type: "string",
      required: false,
    });

    objectDefinitionData = objectDefinitionData;
    dispatch("sync-value");
  };

  const updateName = (data : CustomEvent<{ oldKey : string, newKey : string }>) => {
    objectDefinitionData.find((value) => value.keyName === data.detail.oldKey)
      .keyName = data.detail.newKey;

    objectDefinitionData = objectDefinitionData;
  };

  const syncProp = (data : CustomEvent<{key : string; value : unknown; type : string; required : boolean; subtype : unknown}>) => {
    const property = objectDefinitionData.find((value) => value.keyName === data.detail.key);

    property.value = data.detail.value;
    property.type = data.detail.type;
    property.subtype = data.detail.subtype;
    property.required = data.detail.required;
  
    objectDefinitionData = objectDefinitionData;
  };

  const deleteProp = (propName : string) => {
    const index = objectDefinitionData.findIndex((value) => value.keyName === propName);
    objectDefinitionData.splice(index, 1);
    objectDefinitionData = objectDefinitionData;
  };

  const navigateDefinition = (type : string, indexPath : string) => {
    let pathOnType = "subtype";

    dispatch("navigate-definition", { path: `${pathOnType}.${indexPath}` });
  };

  const navigateCloudedDefinition = (type : string, indexPath : string) => {
    let pathOnType = "subtype";
    dispatch("navigate-definition", {
      path: `${pathOnType}.${indexPath}` , levelOverride: EditorLevels.createAndSignDefinition });
  };

  const shouldDisplayArrow = (defKey : DefinitionData) : boolean => {
    if (defKey.type === "object" || defKey.type === "array" || defKey.type === "enum" || defKey.type === "cloudedObject") {
      if (defKey.type === "array" && (typeof defKey.subtype === "object")) { return true; }
      if (!level.canAddData() && defKey.type === "array") { return false; }
      return true;
    }
  };
</script>

<div class="editor-container">
  {#if objectDefinitionData.length < 1}
    <p class="no-props"> No properties in this object </p>
  {/if}
  {#each objectDefinitionData as defKey, index}
  <div class="properties-holder">
    {#if level.canAddProperty()}
      <div class="exclude" on:click="{() => {deleteProp(defKey.keyName);}}">
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
      propSubType="{defKey.subtype}"
    />
    {#if shouldDisplayArrow(defKey)}
      <div class="see-obj" on:click={() => {
        if (defKey.type === "cloudedObject") {
          navigateCloudedDefinition(defKey.type, index.toString());
          return;
        }
        navigateDefinition(defKey.type, index.toString());
      }}> <RightArrow iconColor="white"/> </div>
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

  .no-props {
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
