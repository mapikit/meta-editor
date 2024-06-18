<script lang="ts">
  import ChevronIcon from "../../icons/chevron-icon.svelte";
  import SelectorList from "./selector-list.svelte";

  export let options : Array<{ label : string; value : unknown }> = [];
  export let field;
  export let styleClass = "";
  export let expandDirection : "top" | "bottom" = "bottom";
  export let selectedLabel : string = undefined;
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

<button class="bg-norbalt-300 relative rounded py-1 flex
  flex-row flex-nowrap border border-norbalt-100 transition-all
  {hoveredClass} {focusClass} select-none {styleClass} cursor-pointer"
  on:click="{(e) => { focused = !focused; e.stopPropagation(); }}"
  on:mouseenter="{() => { hovered = true; }}"
  on:mouseleave="{() => { hovered = false; }}"
>
  <div class="absolute w-full text-sm flex justify-center items-center">
    <ChevronIcon style="stroke-white transition-all {focusChevronClass} translate-y-[4px]"/>
  </div>
  <p class="pl-7 text-left w-full text-sm h-full leading-4"> {selectedLabel ?? field ?? ""} </p>
  {#if focused}
    <SelectorList
      field={field} options={options} expandDirection={expandDirection}
      onChange={(arg) => { hovered = false; onChange(arg); }}/>
  {/if}
</button>
