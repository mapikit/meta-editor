<script lang="ts">
  import type { TypeDefinition } from "@meta-system/object-definition";
  import { createEventDispatcher } from "svelte";
  import TypeSelect from "./type-select.svelte";
  import { EditorLevel, EditorLevels } from "./obj-def-editor-types-and-helpers";
  import EditingField from "./editing-fields/editing-field.svelte";
  import { defaultSubTypesValues, defaultTypesValues } from "./default-types-values";

  // Default mode is Creating an Obj Definition
  export let level : EditorLevel = new EditorLevel(EditorLevels.createDefinition);
  export let initialData : unknown = "";
  export let propName  = "";
  export let initialPropName : string = propName;
  export let propValue : unknown = initialData;
  export let propType : TypeDefinition["type"] = "string";
  export let propSubType : unknown = undefined;
  export let propRequired : TypeDefinition["required"] = false;

  const dispatch = createEventDispatcher();

  const syncProp = () => {
    dispatch("syncProp", {
      key: initialPropName,
      value: propValue,
      type: propType,
      subtype: propSubType,
      required: propRequired,
    });

    initialPropName = propName;
  };

  const updateName = (event) => {
    dispatch("nameUpdate", { oldKey: initialPropName, newKey: event.target.value as string });
  };

  const updateType = (type) => {
    propType = type;
    propValue = defaultTypesValues[type];
    propSubType = defaultSubTypesValues[type];

    if (type === "array") {
      propValue = [];
    }

    syncProp();
  };

  const updateSubtype = (subtype) => {
    propSubType = subtype;
    syncProp();
  };
</script>

<div class="field-container">
  <div class="field-name-type">
    {#if !level.canAddProperty()}
      <div class="name-display"> {initialPropName} </div>
    {:else}
      <input class="name-input" bind:value="{propName}" on:change="{updateName}"/>
      <TypeSelect
        currentType={propType}
        currentSubtype={propSubType}
        on:typeChange={(data) => { updateType(data.detail);}}
        on:subTypeChange={(data) => { updateSubtype(data.detail);}}
      />
    {/if}
    <!-- should edit the type and the name of the Property -->
  </div>
  {#if level.canAddData()}
    <EditingField updateFunction={syncProp} bind:propValue={propValue} editingType={propType} subtype={propSubType}/>
  {/if}
</div>

<style lang="scss">
  .field-container {
    grid-column-start: 2;
    background-color: #323248;
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 6px;
    margin-bottom: 8px;
    font-size: 16px;

    input {
      font-size: 16px;
      color: white;
      padding-left: 6px;
    }
  }

  .field-name-type {
    background-color: #10101a;
    border-radius: 6px;
    display: flex;
    width: 100%;

    input {
      padding: 4px;
      width: calc(100% - 44px);
    }
  }

  .name-display {
    padding: 0 0 0 6px;
  }

  input {
    font-family: 'Dosis';
    background-color: transparent;
    border: none;
    outline: none;
  }
</style>
