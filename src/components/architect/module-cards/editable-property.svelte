<script lang="ts">
  import StringField from "../../../components/object-definition/editing-fields/string-field.svelte";
  import type { ModuleCard } from "../../../common/types/module-card";
  import { clickOutside } from "../helpers/click-outside";
  import clone from "just-clone";

  let editing = false;
  export let storedDefinition : ModuleCard["storedDefinition"];
  export let mode : "input" | "output";
  export let parentPaths : string[];

  $: currentName = parentPaths[parentPaths.length -1];
  $: containerOrder = mode === "input" ? "flex-row-reverse" : "flex-row";
  $: currentDefinition = $storedDefinition[mode];

  let newName = currentName;
  let newType = "string";

  const startEditing = () : void => {
    newName = currentName;

    const finalPath = [...parentPaths.slice(0, parentPaths.length -1)];
    console.log(finalPath, currentDefinition, currentName);
    let tempData = currentDefinition;
    for (let path of finalPath) {
      tempData = tempData[path]["subtype"];
    }

    newType = tempData[currentName].type;

    editing = true;
  };

  // eslint-disable-next-line max-lines-per-function
  const confirmData = () : void => {
    const finalPath = [...parentPaths.slice(0, parentPaths.length -1)];

    storedDefinition.update((currentValue) => {
      const clonedValue = clone(currentValue);
      let tempData = clonedValue[mode];
      for (let path of finalPath) {
        tempData = tempData[path]["subtype"];
      }

      let subtype = undefined;

      if (newType === "array" || newType === "cloudedObject" || newType === "object") {
        subtype = tempData[currentName]["subtype"];
      }

      const finalData = { required: false, type: newType, subtype };
      delete tempData[currentName];

      tempData[newName] = finalData;

      return clonedValue;
    });

    console.log($storedDefinition);
    editing = false;
  };
</script>

{#if !editing}
<div class="flex {containerOrder} px-1 justify-end mt-0.5 first:mt-0 text-xs"
  on:dblclick={startEditing}
>
  <div class=""> {currentName} </div>
  <div class="w-2"/>
  <slot />
</div>
{:else}
<div use:clickOutside on:outclick={confirmData} class="w-28 px-1 text-xs">
  <StringField bind:propValue={newName}/>
</div>
{/if}