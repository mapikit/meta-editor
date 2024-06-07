<script lang="ts">
  import { IconToolboxData } from "../../../entities/models/view-related/icon-toolbox";
  import Tooltip from "../../components/tooltip.svelte";
  import { clickOutside } from "../../lib/click-outside-directive";
  import { slide } from "svelte/transition";
  import { Writable } from "svelte/store";

  export let toolboxData : IconToolboxData;
  export let scrollAmount : Writable<number>;
  let tooltipVisible = false;
  let actionsOpen = false;

  let styleScrollCompensation = "transform: translateX(0px)";

  $: {
    styleScrollCompensation = `transform: translateX(-${$scrollAmount}px);`;
  }
</script>


<button class="relative w-8 h-8 min-w-[2rem] rounded bg-transparent hover:bg-norbalt-300 group/toolbox transition
flex items-center justify-center outline-none"
on:mouseenter={() => { tooltipVisible = true; }}
on:mouseleave={() => { tooltipVisible = false; }}
on:click={() => { actionsOpen = !actionsOpen; }}
on:click_outside={() => { if (!actionsOpen) {return;} actionsOpen = false; }}
use:clickOutside
>
  <svelte:component this={toolboxData.icon}
    class="w-full h-full p-1.5 text-norbalt-200 group-hover/toolbox:text-white transition" />
  <Tooltip tooltipContent="{toolboxData.text}" visible={tooltipVisible && !actionsOpen} position="bottom"
  xCompensation={scrollAmount}/>

  {#if actionsOpen}
  <div class="fixed w-8 h-8"
  style="{styleScrollCompensation}">
    <div transition:slide={{ axis: "y", duration: 200 }}
    class="absolute -bottom-2.5 left-0 translate-y-full rounded-b
      w-56 bg-norbalt-300 cursor-default shadow max-w-lg overflow-y-auto">
      {#each toolboxData.actions as action }
      <button on:click={action.action} class="first:pt-2 last:pb-2 py-1 px-3 hover:bg-norbalt-200
        last:rounded-b w-full text-left text-ellipsis whitespace-nowrap
        flex flex-col
      ">
        {action.actionText}
        {#if action.description}
          <span class="text-offWhite border-t-norbalt-100 border-t max-w-full
          whitespace-break-spaces text-sm"> {action.description} </span>
        {/if}
      </button>
      {/each}
    </div>
  </div>
  {/if}
</button>
