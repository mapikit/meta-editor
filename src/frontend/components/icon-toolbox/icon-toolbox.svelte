<script lang="ts">
  import { globalHeaderStore } from "../../../entities/stores/global-header-store";
  import { IconToolboxData } from "../../../entities/models/view-related/icon-toolbox";
  import Tooltip from "../tooltip.svelte";
  import { clickOutside } from "../../lib/click-outside-directive";

  export let toolboxData : IconToolboxData;
  let tooltipVisible = false;
  let actionsOpen = false;
  let { openLocked } = globalHeaderStore;
</script>


<button class="relative w-12 h-12 bg-transparent hover:bg-norbalt-200 group/toolbox transition
flex items-center justify-center"
on:mouseenter={() => { tooltipVisible = true; }}
on:mouseleave={() => { tooltipVisible = false; }}
on:click={() => { actionsOpen = !actionsOpen; openLocked.set(!openLocked); }}
on:click_outside={() => { if (!tooltipVisible) {return;} actionsOpen = false; openLocked.set(false); }}
use:clickOutside
>
  <svelte:component this={toolboxData.icon}
    class="w-full h-full p-3 text-offWhite group-hover/toolbox:text-brightGreen transition" />
  <Tooltip tooltipContent="{toolboxData.text}" visible={tooltipVisible} position="bottom"/>
  <div>
  </div>
</button>
