<script lang="ts">
  import ChevronIcon from "../../icons/chevron-icon.svelte";

  export let options : Array<{ label : string; value : unknown }> = [];
  export let field;
  export let styleClass = "";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  export let onChange = (_selected : unknown) : void => {};

  let focused = false;
  let hovered = false;

  let focusClass = "";
  let focusChevronClass = "";
  let hoveredClass = "";

  $: focusClass = focused ? "border-white" : "";
  $: hoveredClass = hovered ? "border-offWhite" : "";
  $: focusChevronClass = focused ? "" : "-rotate-180";
</script>

<div class="bg-norbalt-350 relative rounded py-1 flex flex-row flex-nowrap border border-norbalt-100 transition-all {hoveredClass} {focusClass} select-none {styleClass} cursor-pointer"
  on:click="{(e) => { focused = !focused; e.stopPropagation(); }}"
  on:mouseenter="{() => { hovered = true; }}"
  on:mouseleave="{() => { hovered = false; }}"
>
  <div class="absolute left-3 text-sm">
    <ChevronIcon style="stroke-white transition-all {focusChevronClass} translate-y-1.5"/>
  </div>
  <p class="text-center w-full text-sm"> {field} </p>
  {#if focused}
    <div class='bg-norbalt-200 shadow absolute mt-2 top-full w-full rounded text-sm overflow-hidden left-0'>
      {#each options as option }
        <div class="px-2 py-1 first:pt-2 last:pb-2 hover:bg-norbalt-100 transition-all duration-100"
          on:click="{() => {field = option.value; onChange(option); console.log(option); }}"> {option.label} </div>
      {/each}
    </div>
  {/if}
</div>
