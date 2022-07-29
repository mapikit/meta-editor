<script lang="ts">
  import InformationCircleIcon from "../../icons/information-circle-icon.svelte";
  import type { Configuration } from "../../entities/configuration";
  import Tooltip from "../../components/common/tooltip.svelte";
  import Vars from "./vars.svelte";

  export let configuration : Configuration;

  let infoHovered = false;
</script>

<div class="bg-norbalt-350 rounded-md ml-16 p-3 px-4">
  <div class="w-[500px] flex flex-row justify-between items-center">  <!-- title bar -->
    <p class="text-lg font-semibold text-white"> System-Wide Variables <span class="font-normal text-norbalt-100 ml-1"> ({configuration.envs.length}) </span> </p>
    <div class="h-0.5 w-1/3 bg-norbalt-100" />
    <div class="bg-norbalt-300 px-4 py-1 rounded font-medium text-offWhite fill-offWhite transition-all hover:text-white hover:bg-norbalt-200 cursor-pointer flex flex-row items-center">
      Create New
    </div>
    <div
      on:mouseenter="{() => { infoHovered = true; }}"
      on:mouseleave="{() => { infoHovered = false; }}"
      class="relative"
    >
      <InformationCircleIcon style="fill-offWhite stroke-offWhite hover:stroke-white hover:fill-white transition-all"/>
      <Tooltip position="top" tooltipContent="The values set here can be used in any Business Operation. These are their default values, and they can be set to a different value before downloading your configuration file." visible={infoHovered}/>
    </div>
  </div>
  <div class="w-full mt-4 overflow-y-auto">
    <Vars />
  </div>
</div>