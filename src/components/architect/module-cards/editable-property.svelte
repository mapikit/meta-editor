<script lang="ts">
  import StringField from "../../../components/object-definition/editing-fields/string-field.svelte";
  import type { ModuleCard } from "../../../common/types/module-card";
  import { clickOutside } from "../helpers/click-outside";
  import clone from "just-clone";
  import TypeSelect from "../../../components/object-definition/type-select.svelte";
	import { init } from "svelte/internal";

  let editing = false;
  export let storedDefinition : ModuleCard["storedDefinition"];
  export let mode : "input" | "output";
  export let parentPaths : string[];

  $: currentName = parentPaths[parentPaths.length -1];
  $: containerOrder = mode === "input" ? "flex-row-reverse" : "flex-row";
  $: currentDefinition = $storedDefinition[mode];

  let newName = currentName;
  let newType = "string";
  let newSubtype = undefined;

  let initialName = newName;
  let initialType = newType;
  let initialSubtype = newSubtype;

  const startEditing = (ev : MouseEvent) : void => {
    ev.stopPropagation();

    newName = currentName;

    const finalPath = [...parentPaths.slice(0, parentPaths.length -1)];
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

    if (newName === initialName && newType === initialType && newSubtype === initialSubtype) {
      editing = false;
      return;
    }

    storedDefinition.update((currentValue) => {
      const clonedValue = clone(currentValue);
      let tempData = clonedValue[mode];
      for (let path of finalPath) {
        tempData = tempData[path]["subtype"];
      }

      let subtype = undefined;

      if (newType === "array" || newType === "cloudedObject" || newType === "object") {
        subtype = newSubtype;
      }

      const finalData = { required: false, type: newType, subtype };
      delete tempData[currentName];

      tempData[newName] = finalData;

      return clonedValue;
    });

    initialName = newName;
    initialType = newType;
    initialSubtype = newSubtype;
    editing = false;
  };

  const stopPropagation = (ev : MouseEvent) => {
    ev.stopPropagation();
  };
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
  <TypeSelect bind:currentType={newType} bind:currentSubtype={newSubtype} size={"small"} />
</div>
{/if}