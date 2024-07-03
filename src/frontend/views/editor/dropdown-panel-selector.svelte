<script lang="ts">
	import Selector from "../../components/dropdown/selector.svelte";
  import { PanelStore, availablePanels } from "../../../entities/stores/panels-store";
	import { PanelsMutations } from "../../../entities/mutations/panels-mutations";
	import { DockPanelContent } from "../../../entities/models/view-related/dock-panel-content";
	import { SelectorOption } from "../../components/dropdown/select-options-type";
  import { CaretDown } from "phosphor-svelte";
  import { clickOutside } from "src/frontend/lib/click-outside-directive";
  import { fly } from "svelte/transition";

  export let selectedView : PanelStore;
  let { allAvailablePanels: allAvailableViews } = availablePanels;

  let open = false;
  let selectorOptions : SelectorOption<DockPanelContent>[] = [];

  $: {
    selectorOptions = $allAvailableViews.map((view) => {
      return { label: view.title, value: view };
    });
  }

  const selectView = (selected : SelectorOption<DockPanelContent>) : void => {
    PanelsMutations.applyPanelChange(selectedView, selected.value);
  };
</script>

<div class="relative h-full w-fit ml-2 flex justify-center items-center"
use:clickOutside
on:click_outside={() => { open = false; }}
>
  <button class="w-5 h-5 rounded-sm text-offWhite hover:text-white bg-transparent
  hover:bg-norbalt-200 transition justify-center items-center flex"
  on:click={() => { open = !open; }}>
    <CaretDown class="{open ? "rotate-180" : "rotate-0"} transition-transform"/>
  </button>

  {#if open}
  <div class="absolute top-full left-0" transition:fly={{ x:0, y: -20, duration: 160 }}>
    <div class="fixed w-8 h-8 rounded bg-norbalt-300 outline outline-2 outline-norbalt-200 overflow-hidden">
      aaaaa
    </div>
  </div>
  {/if}
</div>

