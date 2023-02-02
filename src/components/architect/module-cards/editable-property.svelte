<script lang="ts">
  import StringField from "../../../components/object-definition/editing-fields/string-field.svelte";
  import type { ModuleCard } from "../../../common/types/module-card";
  import { clickOutside } from "../helpers/click-outside";
  import clone from "just-clone";
  import TypeSelect from "../../../components/object-definition/type-select.svelte";
  import { onDestroy } from "svelte";
  import { omitObjKey, renameObjKey } from "../../../common/helpers/renameObjectKey";
  import CrossIcon from "../../../icons/cross-icon.svelte";
  import type { ObjectDefinition } from "@meta-system/object-definition";

  let editing = false;
  export let storedDefinition : ModuleCard["storedDefinition"];
  export let mode : "input" | "output";
  export let parentPaths : string[];
  let isItemOfArray = false;

  $: containerOrder = mode === "input" ? "flex-row-reverse" : "flex-row";

  // eslint-disable-next-line max-lines-per-function
  const getCurrentType = () : string => {
    let tempData = getParentDefinition();
    if (!tempData) { return "string"; };

    return tempData[currentName].type;
  };

  const getParentDefinition = () : ObjectDefinition => {
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

    return tempData;
  };

  let currentName = parentPaths[parentPaths.length -1];
  let currentType = getCurrentType();
  let newName = currentName;
  let newType = "string";
  let newSubtype = undefined;

  let initialSubtype = newSubtype;
  
  $: isLastArrayItem = $storedDefinition && isItemOfArray && getParentDefinition()[Number(currentName) + 1] === undefined;

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

    if (!tempData[currentName]) { return; } // when the prop was removed
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

  // eslint-disable-next-line max-lines-per-function
  const removeProp = () : void => {
    const finalPath = [...parentPaths.slice(0, parentPaths.length -1)];

    // eslint-disable-next-line max-lines-per-function
    storedDefinition.update((currentValue) => {
      const clonedValue = clone(currentValue);
      let tempData : any = clonedValue[mode];
      let lastComplimentary = "";
      for (let path of finalPath) {
        let complimentaryPathName = tempData[path].type === "array" ? "data" : "subtype";
        if (path === finalPath[finalPath.length -1]) {
          tempData = tempData[path];
          lastComplimentary = complimentaryPathName;
          break;
        };

        tempData = tempData[path][complimentaryPathName];
      }

      tempData[lastComplimentary] = omitObjKey(currentName, tempData[lastComplimentary]);

      return clonedValue;
    });
  };

  const stopPropagation = (ev : Event) : void => {
    ev.stopPropagation();
  };

  onDestroy(unsub);
</script>

{#if !editing}
<div class="flex {containerOrder} px-1 justify-end mt-0.5 first:mt-0 text-xs items-center"
  on:dblclick={startEditing}
>
  {#if isLastArrayItem}
    <div on:click={removeProp} class="w-4 h-full stroke-offWhite flex justify-center items-center cursor-pointer p-1">
      <CrossIcon style="stroke-inherit w-1.5 h-1.5" />
    </div>
  {/if}
  <div class="whitespace-nowrap"> {currentName} </div>
  <div class="w-2"/>
  <slot />
</div>
{:else}
<div use:clickOutside on:outclick={confirmData} on:mousedown={stopPropagation} on:keydown={stopPropagation} on:keyup={stopPropagation} on:dblclick={stopPropagation} class="w-28 px-1 text-xs flex {containerOrder} items-center flex-nowrap">
  <div on:click={removeProp} class="w-3 h-full stroke-offWhite flex justify-center items-center cursor-pointer">
    <CrossIcon style="stroke-inherit w-1.5 h-1.5" />
  </div>
  <StringField bind:propValue={newName} size={"small"}/>
  <div class="w-1"/>
  <TypeSelect bind:currentType={newType} bind:currentSubtype={newSubtype} size={"small"} omittedTypes={["object"]}/>
</div>
{/if}