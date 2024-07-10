<script lang="ts">
  import { DockPanelContent } from "src/entities/models/view-related/dock-panel-content";
  import { PanelsMutations } from "src/entities/mutations/panels-mutations";
  import { PanelStore } from "src/entities/stores/panels-store";

  export let selectedView : PanelStore;
  export let group : DockPanelContent[];
  export let title : string;
  export let textColor : "yellow" | "blue" | "green" | "red" | "default" = "default";
  let clazz : string = "";
  export let onSelect : () => void;
  export { clazz as class };

  let color = textColor === "yellow"
    ? "text-ochreYellow" : textColor === "blue"
      ? "text-royalBlue" : textColor === "green"
        ? "text-brightGreen" : textColor === "red"
          ? "text-roseRed" : "text-offWhite";

  const selectView = (selected : DockPanelContent) : void => {
    PanelsMutations.applyPanelChange(selectedView, selected);
  };
</script>

<div class="rounded bg-norbalt-350 px-2 py-1 {clazz}">
  <p class="font-bold {color}">{title}</p>
  <div class="w-full h-24 overflow-y-scroll scroll-pl-2"> <!-- Panels List-->
    {#each group as item }
      <button class="overflow-hidden whitespace-nowrap text-offWhite overflow-ellipsis
      hover:text-white transition w-full max-w-full text-left"
      on:click={() => { selectView(item); onSelect(); }}> {item.title} </button>
    {/each}
  </div>
</div>
