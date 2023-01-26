<script lang="ts">
  import StringField from "../../../components/object-definition/editing-fields/string-field.svelte";
  import type { ModuleCard } from "../../../common/types/module-card";
  import { clickOutside } from "../helpers/click-outside";
  import clone from "just-clone";
  import TypeSelect from "../../../components/object-definition/type-select.svelte";
  import { onDestroy } from "svelte";
  import { renameObjKey } from "../../../common/helpers/renameObjectKey";

  let editing = false;
  export let storedDefinition : ModuleCard["storedDefinition"];
  export let mode : "input" | "output";
  export let parentPaths : string[];
  let isItemOfArray = false;

  $: containerOrder = mode === "input" ? "flex-row-reverse" : "flex-row";

  // eslint-disable-next-line max-lines-per-function
  const getCurrentType = () : string => {
    const finalPath = [...parentPaths.slice(0, parentPaths.length -1)];
    let tempData = $storedDefinition[mode];
    for (let path of finalPath) {
      if (!tempData) continue;

      if (tempData[path].type === "array") {
        tempData = tempData[path]["data"];
        isItemOfArray = true;
        continue;
      }

      isItemOfArray = false;
      tempData = tempData[path]["subtype"];
    }

    if (!tempData) { return "string"; };

    return tempData[currentName].type;
  };

  let currentName = parentPaths[parentPaths.length -1];
  let currentType = getCurrentType();
  let newName = currentName;
  let newType = "string";
  let newSubtype = undefined;

  let initialSubtype = newSubtype;
  
  const startEditing = (ev : MouseEvent) : void => {
    ev.stopPropagation();

    if (isItemOfArray) { return; }
    newName = currentName;
    newType = getCurrentType();

    editing = true;
  };

  // keep display synced with store, but only update if affected
  const unsub = storedDefinition.subscribe((value) => {
    const finalPath = [...parentPaths.slice(0, parentPaths.length -1)];
    let tempData = value[mode];

    for (let path of finalPath) {
      if (tempData[path].type === "array") {
        tempData = tempData[path]["data"]; continue;
      }

      tempData = tempData[path]["subtype"];
    }

    if (currentName === newName && tempData[currentName].type === currentType) { return; }

    currentName = newName;
    currentType = getCurrentType();
  });

  // eslint-disable-next-line max-lines-per-function
  const confirmData = () : void => {
    const finalPath = [...parentPaths.slice(0, parentPaths.length -1)];

    if (newName === currentName && newType === currentType && newSubtype === initialSubtype) {
      editing = false;
      return;
    }

    // eslint-disable-next-line max-lines-per-function
    storedDefinition.update((currentValue) => {
      const clonedValue = clone(currentValue);
      let tempData = clonedValue[mode];
      for (let path of finalPath) {
        let complimentaryPathName = tempData[path].type === "array" ? "data" : "subtype";
        tempData = tempData[path][complimentaryPathName];
      }

      let subtype = undefined;

      if (newType === "array" || newType === "cloudedObject" || newType === "object") {
        subtype = newSubtype;
      }

      const finalData = { required: false, type: newType, subtype };
      tempData[currentName] = finalData;

      if (currentName !== newName) {
        let updatedTempData = clonedValue[mode];
        for (let path of finalPath.slice(0, finalPath.length -1)) {
          let complimentaryPathName = updatedTempData[path].type === "array" ? "data" : "subtype";
          updatedTempData = updatedTempData[path][complimentaryPathName];
        }

        updatedTempData[finalPath[finalPath.length-1]]["subtype"] = renameObjKey(tempData, currentName, newName);;
      }

      return clonedValue;
    });

    currentName = newName;
    currentType = newType;
    initialSubtype = newSubtype;
    editing = false;
  };

  const stopPropagation = (ev : MouseEvent) => {
    ev.stopPropagation();
  };

  onDestroy(unsub);
</script>

{#if !editing}
<div class="flex {containerOrder} px-1 justify-end mt-0.5 first:mt-0 text-xs"
  on:dblclick={startEditing}
>
  <div class="whitespace-nowrap"> {currentName} </div>
  <div class="w-2"/>
  <slot />
</div>
{:else}
<div use:clickOutside on:outclick={confirmData} on:mousedown={stopPropagation} on:dblclick={stopPropagation} class="w-28 px-1 text-xs flex {containerOrder} flex-nowrap">
  <StringField bind:propValue={newName} size={"small"}/>
  <div class="w-1"/>
  <TypeSelect bind:currentType={newType} bind:currentSubtype={newSubtype} size={"small"} omittedTypes={["object"]}/>
</div>
{/if}