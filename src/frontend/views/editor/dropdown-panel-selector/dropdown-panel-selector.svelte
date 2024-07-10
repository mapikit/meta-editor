<script lang="ts">
  import { PanelStore, availablePanels } from "../../../../entities/stores/panels-store";
  import { DockPanelContent } from "../../../../entities/models/view-related/dock-panel-content";
  import { CaretDown, MagnifyingGlass } from "phosphor-svelte";
  import { clickOutside } from "src/frontend/lib/click-outside-directive";
  import { fly } from "svelte/transition";
  import EditableTextField from "src/frontend/components/text-fields/editable-text-field.svelte";
  import CardButton from "src/frontend/components/buttons/card-button.svelte";
  import DropdownPanelGroup from "./dropdown-panel-group.svelte";
  import Fuse from "fuse.js";

  export let selectedView : PanelStore;
  let { allAvailablePanels: allAvailableViews } = availablePanels;

  let open = false;
  let rootLevelPanels : DockPanelContent[] = [];
  let addonsPanels : DockPanelContent[] = [];
  let schemasPanels : DockPanelContent[] = [];
  let bopsPanels : DockPanelContent[] = [];

  let textSearch = "";
  let panelsGroup = [];
  const defaultFuzzyOptions = { keys: ["title"] };
  let fuzzySearch = new Fuse([], defaultFuzzyOptions);
  let matchedViews : DockPanelContent[] = null; // Assumes null if not searching

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
      return !([].concat(addonsPanels, schemasPanels, bopsPanels).includes(view));
    });

    panelsGroup = [
      { title: "Top-Level", data: rootLevelPanels, color: "default" },
      { title: "Schemas", data: schemasPanels, color: "red" },
      { title: "Business Operations", data: bopsPanels, color: "yellow" },
      { title: "Addons", data: addonsPanels, color: "green" },
    ];
  }

  const dismiss = () : void => { open = false; resetSearch(); };
  const search = () : void => {
    if (textSearch === "") { matchedViews = null; return; }

    fuzzySearch.setCollection($allAvailableViews);
    matchedViews = fuzzySearch.search(textSearch).map(res => res.item);
  };

  const resetSearch = () : void => {
    textSearch = "";
    matchedViews = null;
  };
</script>

<div class="relative h-full w-fit ml-2 flex justify-center items-center"
use:clickOutside
on:click_outside={() => { open = false; resetSearch(); }}
>
  <button class="w-5 h-5 rounded-sm text-offWhite hover:text-white bg-transparent
  hover:bg-norbalt-200 transition justify-center items-center flex"
  on:click={() => { open = !open; if (!open) resetSearch(); }}>
    <CaretDown class="{open ? "rotate-180" : "rotate-0"} transition-transform"/>
  </button>

  <!-- svelte-ignore a11y-no-static-element-interactions --> <!-- Honestly this is just to stop propagations -->
  <div class="absolute top-full left-0.5"
    on:mousedown={(e) => e.stopPropagation()}
  >
    {#if open}
    <div class="fixed rounded bg-norbalt-300 overflow-hidden px-2 py-1 pb-2 shadow-lg
    flex flex-col justify-start items-center z-10"transition:fly={{ x:0, y: -20, duration: 160 }}>
      <div class="flex w-full h-8 flex-row items-center">
        <EditableTextField class="w-48" text={textSearch}
          onChange={(v) => { textSearch = v; search(); }} /> <!-- strong candidate for debounce later on -->
        <CardButton clickFunction={() => { search(); } }
          class="w-8 bg-transparent" noOutline hoverColor="green">
          <MagnifyingGlass />
        </CardButton>
      </div>
      <div class="grid grid-cols-2 gap-2 mt-2 w-[32.5rem]">
        {#each panelsGroup as panelGroup }
          <DropdownPanelGroup
          matchedViews={matchedViews}
          selectedView={selectedView}
          group={panelGroup.data}
          title={panelGroup.title}
          class="w-64"
          onSelect={dismiss}
          textColor={panelGroup.color}/>
        {/each}
      </div>
    </div>
    {/if}
  </div>
</div>

