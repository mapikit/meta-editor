<script lang="ts">
  import HandIcon from "../../icons/hand-icon.svelte";
  import CursorIcon from "../../icons/cursor-icon.svelte";
  import ScissorsIcon from "../../icons/scissors-icon.svelte";
  import SaveIcon from "../../icons/save-icon.svelte";
  import TestBopIcon from "../../icons/test-bop-icon.svelte";
  import Tooltip from "../common/tooltip.svelte";

  let hoverPan = false;

</script>

<div class="absolute top-6 h-10 flex flex-row left-[50%] -translate-x-[50%]">
  <div class="rounded-md bg-norbalt-200 w-10 flex items-center justify-center text-center transition-all hover:bg-norbalt-100 cursor-pointer shadow fill-offWhite hover:fill-white">
    <CursorIcon style="w-4 fill-inherit"/>
  </div>

  <div class="flex flex-row items-center justify-center bg-norbalt-200 ml-5 rounded-md shadow overflow-hidden">
    <div class="flex items-center justify-center w-10 h-full hover:bg-norbalt-100 transition-all cursor-pointer fill-offWhite hover:fill-white"
      on:mouseenter="{() => {hoverPan=true;}}" on:mouseleave="{() => {hoverPan=false;}}"
    >
      <HandIcon style="h-6 w-5 fill-inherit" />
      <Tooltip position="bottom" tooltipContent="Pan Tool" visible="{hoverPan}"/>
    </div>
    <div class="flex items-center justify-center w-10 h-full hover:bg-norbalt-100 transition-all cursor-pointer fill-offWhite hover:fill-white">
      <ScissorsIcon style="fill-inherit" />
    </div>
    <div class="flex items-center justify-center w-10 h-full hover:bg-norbalt-100 transition-all cursor-pointer fill-offWhite hover:fill-white">
      <SaveIcon style="fill-inherit"/>
    </div>
    <div class="flex items-center justify-center w-10 h-full hover:bg-norbalt-100 transition-all cursor-pointer fill-offWhite hover:fill-white">
      <TestBopIcon style="fill-inherit" />
    </div>
  </div>

</div>