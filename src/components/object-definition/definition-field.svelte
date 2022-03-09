<script lang="ts">
  import type { TypeDefinition } from "@meta-system/object-definition";
  import { createEventDispatcher } from "svelte";
  import TypeSelect from "./type-select.svelte";
  import { EditorLevel, EditorLevels } from "./obj-def-editor-types-and-helpers";

  // Default mode is Creating an Obj Definition
  export let level : EditorLevel = new EditorLevel(EditorLevels.createDefinition);
  export let initialPropName : string = "prop (n)";
  export let initialData : unknown = "";
  let propName : string = initialPropName;
  export let propValue : unknown = initialData;
  export let propType : TypeDefinition["type"] = "string";
  export let propRequired : TypeDefinition["required"] = false;

  const dispatch = createEventDispatcher();

  const updateProp = () => {
    dispatch("updateProp", {
      key: initialPropName,
      value: propValue,
      type: propType,
      required: propRequired,
    })
  }

  const updateName = (event) => {
    dispatch("nameUpdate", { oldKey: initialPropName, newKey: event.target.value as string });
  }

  const updateType = (type) => {
    propType = type;
    updateProp();
  }
</script>

<div class="field-container">
  <div class="field-name-type">
    {#if !level.canAddProperty()}
      <div> {initialPropName} </div>
    {:else}
      <input class="name-input" bind:value="{propName}" on:change="{updateName}"/>
      <TypeSelect currentType={propType} on:typeChange={(data) => { updateType(data.detail)}}/>
    {/if}
    <!-- should edit the type and the name of the Property -->
  </div>
  {#if level.canAddData()}
    <div class="value-input">
      <input bind:value="{propValue}" on:change="{updateProp}"/>
    </div>
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

  .value-input {
    padding: 4px;
    background-color: #323248;
    border-radius: 0 0px 6px 6px;
  }

  input {
    font-family: 'Dosis';
    background-color: transparent;
    border: none;
    outline: none;
  }
</style>
