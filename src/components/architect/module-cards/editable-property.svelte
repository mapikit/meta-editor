<script lang="ts">
  import type { ModuleCard } from "../../../common/types/module-card";
  import { clickOutside } from "../helpers/click-outside";

  let editing = false;
  export let storedDefinition : ModuleCard["storedDefinition"];
  export let mode : "input" | "output";
  export let parentPaths : string[];

  $: currentName = parentPaths[parentPaths.length -1];
  $: containerOrder = mode === "input" ? "flex-row-reverse" : "flex-row";

  let newName = currentName;

  const toggleEdit = () : void => { editing = !editing; };
</script>

{#if !editing}
<div class="flex {containerOrder} px-1 justify-end mt-0.5 first:mt-0 text-xs"
  on:dblclick={toggleEdit}
>
  <div class=""> {currentName} </div>
  <div class="w-2"/>
  <slot />
</div>
{:else}
<div use:clickOutside on:outclick={toggleEdit}>
  EDIÇÃO AQUI :D
</div>
{/if}