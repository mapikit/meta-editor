<script lang="ts">
  import { Writable, writable } from "svelte/store";
  import { SubdivisionStore } from "../../../../entities/stores/dock-subdivision-store";
  import DropdownPanelSelector from "../dropdown-panel-selector.svelte";
  import PanelOptions from "./panel-options.svelte";
  import { ArrowLeft } from "phosphor-svelte";
  import { PanelsMutations } from "../../../../entities/mutations/panels-mutations";

  export let parent : SubdivisionStore;
  export let currentElement : SubdivisionStore;

  let { view } = currentElement;
  let title : Writable<string> = writable(undefined);
  let finalTitle = $title ? $title : "Not selected";
  let { typeHistory } = $view ?? {};
  let hasPast = false;

  $: {
    title = $view.title;
    finalTitle = $title ? $title : "Not selected";
    typeHistory = $view.typeHistory;
    hasPast = $typeHistory.length > 0;
  }

</script>

<header class="w-full h-9 px-2 py-1 flex flex-row items-center">
  {#if hasPast}
    <button class="w-5 h-5 hover:bg-norbalt-200 flex justify-center items-center mr-2 rounded-sm transition
    text-offWhite hover:text-white" on:click={() => { PanelsMutations.goBackPanel($view); }}>
      <ArrowLeft />
    </button>
  {/if}
  <span class="text-offWhite hover:text-white transition-colors
  text-md font-semibold whitespace-nowrap"> {finalTitle} </span>
  <DropdownPanelSelector selectedView={$view}/>
  <div class="flex flex-row justify-end flex-1">

    <PanelOptions parent={parent} currentElement={currentElement}/>
  </div>
</header>
