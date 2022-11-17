<script lang="ts">
  import type { TypeDefinition } from "@meta-system/object-definition";
  import ArrowIcon from "../../../icons/arrow-icon.svelte";
  import Typedot from "../../../components/common/typedot.svelte";

  export let mode : "input" | "output";
  export let typeDetails : TypeDefinition<{}>;

  let deepOpen = false;
  // If it is a deep type, should be albe to open and select deeper options
  // Is still selectable itself

  $: isDeep = ["array", "object", "cloudedObject"].includes(typeDetails.type);
  $: containerOrder = mode === "input" ? "flex-row-reverse" : "flex-row";
  $: deepArrowRotate = mode === "input" ? "rotate-180" : "flex-row-reverse";
</script>

<div class="relative flex {containerOrder} justify-center items-center">
  <div class="w-4 h-4 rounded flex justify-center items-center hover:bg-norbalt-350 bg-transparent transition-all"> <!-- Clickable section -->
    <Typedot size={2} type={typeDetails} />
  </div>

  {#if isDeep}
    <div class="w-3 h-3 flex {deepArrowRotate} cursor-pointer justify-center items-center top-0 transition-all stroke-offWhite hover:stroke-white">
      <ArrowIcon style="h-1.5 w-1.5 stroke-inherit"/>
    </div>
  {/if}
</div>