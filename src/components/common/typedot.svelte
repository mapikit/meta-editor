<script lang="ts">
  import type { TypeDefinition } from "@meta-system/object-definition";
  import { typeColors } from "../../common/styles/type-colors";

  export let type : TypeDefinition;
  export let size : 2 | 3;

  $: dotSize = size === 2 ? "w-2 h-2" : "w-3 h-3";
  $: dotShift = size === 2 ? "ml-1" : "ml-1.5";
  $: color = typeColors[type.type];
</script>

<div class="rounded-full {dotSize} overflow-hidden" style="background-color: {color}">
  {#if type.type === "array"}
    <div class="{dotSize} {dotShift} " style="background-color: {typeColors[type["subtype"]]}"/>
  {/if}
</div>