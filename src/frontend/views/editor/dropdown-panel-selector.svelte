<script lang="ts">
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
  let rootLevelPanels : DockPanelContent[] = [];
  let addonsPanels : DockPanelContent[] = [];
  let schemasPanels : DockPanelContent[] = [];
  let bopsPanels : DockPanelContent[] = [];

  $: {
    addonsPanels = $allAvailableViews.filter((view) => {
      return view.type === "Addon Configure";
    });
    schemasPanels = $allAvailableViews.filter((view) => {
      return view.type === "Configure Schema";
    });
    bopsPanels = $allAvailableViews.filter((view) => {
      return view.type === "BOps Flow";
    });
    rootLevelPanels = $allAvailableViews.filter((view) => {
      !([].concat(addonsPanels, schemasPanels, bopsPanels).includes(view));
    })
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
  <div class="absolute top-full left-0.5" transition:fly={{ x:0, y: -20, duration: 160 }}>
    <div class="fixed w-fit h-8 rounded bg-norbalt-300 outline outline-2 outline-norbalt-200 overflow-hidden px-2 py-1
    flex flex-col justify-start items-center">
      <div class="bg-norbalt-400 rounded-sm w-48 h-8">

      </div>
      <div class="w-full flex-1">
        {#each schemasPanels as schema }
          {schema.title}
        {/each}
      </div>
    </div>
  </div>
  {/if}
</div>

