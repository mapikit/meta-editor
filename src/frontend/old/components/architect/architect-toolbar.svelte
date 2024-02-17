<script lang="ts">
  import HandIcon from "../../icons/hand-icon.svelte";
  import CursorIcon from "../../icons/cursor-icon.svelte";
  import ScissorsIcon from "../../icons/scissors-icon.svelte";
  import SaveIcon from "../../icons/save-icon.svelte";
  import TestBopIcon from "../../icons/test-bop-icon.svelte";
  import Tooltip from "../common/tooltip.svelte";
  import { storageManager } from "../../stores/storage-manager";
  import type { UIBusinessOperation } from "../../entities/business-operation";
  import { getContext } from "svelte";
  import { currentConfigId } from "../../stores/configuration-store";
  import type { ArchitectContext } from "../../entities/auxiliary-entities/architect-context";
  import CuttingTool from "./cutting-tool.svelte";
import Spinner from "../../icons/spinner.svelte";

  const currentBop = getContext<UIBusinessOperation>("currentBop");
  const architectContext = getContext<ArchitectContext>("architectContext");
  const { currentMode } = architectContext;

  let hoverCursor = false;
  let hoverScissors = false;
  let hoverSave = false;
  let hoverTest = false;
  let hoverPan = false;

  const save = async () : Promise<void> => {
    await storageManager.manager.updateBop($currentConfigId, currentBop);
  };

  let saveAwait : Promise<void> = undefined;

  $: cuttingStyle = $currentMode === "cutting" ? "fill-ochreYellow" : "fill-offWhite";
  $: panningStyle = $currentMode === "panning" ? "fill-ochreYellow" : "fill-offWhite";

  const toggleCutting = () : void => {
    if (architectContext.isCutting) {
      architectContext.currentMode.set("default");
      return;
    }

    architectContext.currentMode.set("cutting");
  };
</script>

<div class="absolute mt-3 h-10 flex flex-row left-[50%] -translate-x-[50%]">
  <div class="relative rounded-md bg-norbalt-200 w-10 flex items-center justify-center text-center transition-all hover:bg-norbalt-100 cursor-pointer shadow fill-offWhite hover:fill-white"
    on:mouseenter="{() => {hoverCursor=true;}}" on:mouseleave="{() => {hoverCursor=false;}}"
  >
    <CursorIcon style="w-4 fill-inherit"/>
    <Tooltip position="bottom" tooltipContent="Select Tool" visible="{hoverCursor}"/>
  </div>

  <div class="flex flex-row items-center justify-center bg-norbalt-200 ml-5 rounded-md shadow overflow-hidden">
    <div class="relative flex items-center justify-center w-10 h-full hover:bg-norbalt-100 transition-all cursor-pointer hover:fill-white {panningStyle}"
      on:mouseenter="{() => {hoverPan=true;}}" on:mouseleave="{() => {hoverPan=false;}}"
    >
      <HandIcon style="h-6 w-5 fill-inherit" />
      <Tooltip position="bottom" tooltipContent="Pan Tool" visible="{hoverPan}"/>
    </div>
    <div class="relative flex items-center justify-center w-10 h-full hover:bg-norbalt-100 transition-all cursor-pointer hover:fill-white {cuttingStyle}"
      on:click={toggleCutting}
      on:mouseenter="{() => {hoverScissors=true;}}" on:mouseleave="{() => {hoverScissors=false;}}"
    >
      <ScissorsIcon style="fill-inherit" />
      <Tooltip position="bottom" tooltipContent="Cut connections Tool" visible="{hoverScissors}"/>
      {#if $currentMode === "cutting"}
        <CuttingTool />
      {/if}
    </div>
    <div class="relative flex items-center justify-center w-10 h-full hover:bg-norbalt-100 transition-all cursor-pointer fill-offWhite hover:fill-white"
      on:mouseenter="{() => {hoverSave=true;}}" on:mouseleave="{() => {hoverSave=false;}}"
      on:click={() => { saveAwait = save(); }}
    >
    {#await saveAwait}
      <Spinner height="20"/>
    {:then done}
      <SaveIcon style="fill-inherit"/>
      <Tooltip position="bottom" tooltipContent="Save" visible="{hoverSave}"/>
    {/await}
     
    </div>
    <div class="relative flex items-center justify-center w-10 h-full hover:bg-norbalt-100 transition-all cursor-pointer fill-offWhite hover:fill-white"
      on:mouseenter="{() => {hoverTest=true;}}" on:mouseleave="{() => {hoverTest=false;}}"
    >
      <TestBopIcon style="fill-inherit" />
      <Tooltip position="bottom" tooltipContent="Test Business Operation" visible="{hoverTest}"/>
    </div>
  </div>

</div>