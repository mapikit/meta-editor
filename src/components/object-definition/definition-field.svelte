<script lang="ts">
  import type { TypeDefinition } from "@meta-system/object-definition";
  import { createEventDispatcher } from "svelte";
  import TypeSelect from "./type-select.svelte";
  import { EditorLevel, EditorLevels } from "./obj-def-editor-types-and-helpers";
  import EditingField from "./editing-fields/editing-field.svelte";
  import { defaultSubTypesValues, defaultTypesValues } from "./default-types-values";
  import CrossIcon from "../../icons/cross-icon.svelte";

  // Default mode is Creating an Obj Definition
  export let level : EditorLevel = new EditorLevel(EditorLevels.createDefinition);
  export let initialData : unknown = "";
  export let propName ;
  export let initialPropName : string = propName;
  export let propValue : unknown = initialData;
  export let propType : TypeDefinition["type"] = "string";
  export let propSubType : unknown;
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

  const deleteProp = () : void => {
    dispatch("delete-prop", propName);
  };

</script>

<div class="bg-norbalt-200 rounded flex flex-row col-start-1 col-end-1 h-8 items-center w-full">
  <TypeSelect
    currentType={propType}
    currentSubtype={propSubType}
    on:typeChange={(data) => { updateType(data.detail);}}
    on:subTypeChange={(data) => { updateSubtype(data.detail);}}
  />
  <div class="flex-1 flex flex-row items-center justify-between mx-2">
    {#if !level.canAddProperty()}
      <div class="flex-1 bg-norbalt-300 border rounded border-norbalt-100 h-6 mr-2 last:mr-0"> {initialPropName} </div>
    {:else}
      <div class="flex-1 mr-2 last:mr-0">
        <input class="w-full bg-norbalt-300 border rounded border-norbalt-100 transition-all hover:border-offWhite focus:border-offWhite px-2 outline-none h-6" bind:value="{propName}" on:change="{updateName}"/>
      </div>
    {/if}
    {#if level.canAddData()}
      <EditingField updateFunction={syncProp} bind:propValue={propValue} editingType={propType} subtype={propSubType}/>
    {/if}
  </div>
  {#if level.canAddProperty()}
  <div class="stroke-offWhite hover:stroke-roseRed transition-all w-7 flex items-center justify-center h-full cursor-pointer" on:click="{deleteProp}">
    <CrossIcon style="stroke-inherit"/>
  </div>
  {/if}
</div>