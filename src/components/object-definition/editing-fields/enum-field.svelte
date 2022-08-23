<script lang="ts">
  import ChevronIcon from "../../../icons/chevron-icon.svelte";
  import { fade } from "svelte/transition";

  export let subtype = [];
  export let propValue = undefined;
  export let updateFunction = () => {};

  let collapsed = true;
  let displayText = "Select an option";
  let hasPropValue = Boolean(propValue);
  let hasAvailableOptions = subtype.length > 0;

  $: {
    displayText = propValue ? propValue : "Select an option";
    hasPropValue = Boolean(propValue);
    hasAvailableOptions = subtype.length > 0;
  }

  $: noSelectedColor = hasPropValue ? "text-white" : "text-offWhite";
  $: chevronSelecting = collapsed ? "" : "rotate-180";
</script>

<div class="flex-1 bg-norbalt-300 border rounded border-norbalt-100 hover:border-offWhite h-6 transition-all">
  <div
    class="relative px-2 {noSelectedColor} w-full flex flex-row justify-between items-center stroke-offWhite hover:stroke-white cursor-pointer"
    on:click="{() => { collapsed = !collapsed; }}"
  >
    <p> {displayText} </p>
    <div class="{chevronSelecting} transition-all">
      <ChevronIcon style="stroke-inherit transition-all" />
    </div>
    {#if !collapsed}
    <div class="absolute bg-norbalt-200 w-full top-7 left-0 rounded shadow-contrast text-white z-10" transition:fade={{ duration: 90 }}>
      <div class="">
        {#if hasAvailableOptions}
          {#each subtype as enumOption }
          <p class="px-3 py-0.5 first:pt-1.5 first:rounded-t last:pb-1.5 last:rounded-b hover:bg-norbalt-100 transition-all cursor-pointer" on:click="{() => {
            propValue = enumOption;
            updateFunction();
          }}">
            {enumOption}
          </p>
          {/each}
        {:else}
          <p class="px-3 py-0.5 first:pt-1.5 first:rounded-t last:pb-1.5 last:rounded-b text-offWhite cursor-default">
            No options available
          </p>
        {/if}
      </div>
    </div>
    {/if}
  </div>
</div>
