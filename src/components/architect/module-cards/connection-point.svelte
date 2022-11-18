<script lang="ts">
  import type { TypeDefinition } from "@meta-system/object-definition";
  import ArrowIcon from "../../../icons/arrow-icon.svelte";
  import Typedot from "../../../components/common/typedot.svelte";
  import CrossIcon from "../../../icons/cross-icon.svelte";

  export let mode : "input" | "output";
  export let typeDetails : TypeDefinition;

  let deepOpen = false;
  // If it is a deep type, should be albe to open and select deeper options
  // Is still selectable itself

  $: isDeep = ["array", "object", "cloudedObject"].includes(typeDetails.type);
  $: containerOrder = mode === "input" ? "flex-row-reverse" : "flex-row";
  $: deepArrowRotate = mode === "input" ? "rotate-180" : "flex-row-reverse";
  $: innerTypePosition = mode === "input" ? "-translate-x-[calc(100%_+_6px)]" : "translate-x-[6px] left-[100%]";

  let canEditType = ["array", "cloudedObject"].includes(typeDetails.type);

  const toggleDeep = (e : MouseEvent) : void => {
    e.stopPropagation();
    deepOpen = !deepOpen;
  };

  const getDeepProperties = () : Array<{key : string; type : TypeDefinition }> => {
    if (typeDetails["type"] === "array") { return []; }

    console.log(typeDetails);
    const keys = Object.keys(typeDetails["subtype"] ?? {});

    let result = [];
    keys.forEach((key : string) => {
      result.push({ key, type: typeDetails["subtype"][key] });
    });

    return result;
  };
</script>

<div class="relative">
  <div class="relative flex {containerOrder} justify-center items-center">
    <div class="w-4 h-4 rounded flex justify-center items-center hover:bg-offWhite bg-transparent transition-all"> <!-- Clickable section -->
      <Typedot size={2} type={typeDetails} />
    </div>

    {#if isDeep}
      <div class="w-3 h-3 flex {deepArrowRotate} cursor-pointer justify-center items-center top-0 transition-all stroke-offWhite hover:stroke-white"
        on:click={toggleDeep}
      >
        <ArrowIcon style="h-1.5 w-1.5 stroke-inherit"/>
      </div>
    {/if}
  </div>

  {#if deepOpen && isDeep}
    <div class="absolute bg-norbalt-200 shadow rounded {innerTypePosition} py-1 flex flex-col justify-end -top-0.5 min-w-[3.5rem]">
      {#each getDeepProperties() as property}
        <div class="flex {containerOrder} px-1 justify-end mt-0.5 first:mt-0 text-xs">
          <div class=""> {property.key} </div>
          <div class="w-2"/>
          <svelte:self mode={mode} typeDetails={property.type}/>
        </div>
      {/each}
      {#if canEditType}
        <div class="border cursor-pointer rounded border-norbalt-100 hover:border-offWhite stroke-norbalt-100 hover:stroke-offWhite transition-all p-1 mx-1 flex justify-center items-center">
          <CrossIcon style="stroke-inherit w-1.5 h-1.5 rotate-45"/>
        </div>
      {/if}
    </div>
  {/if}
</div>