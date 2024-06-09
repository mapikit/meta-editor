<script lang="ts">
  import { globalHeaderStore } from "../../../entities/stores/global-header-store";
  import IconToolbox from "./icon-toolbox.svelte";
  import { writable } from "svelte/store";

  let { title, iconToolboxes } = globalHeaderStore;
  let scroller : HTMLElement;
  let scrollAmount = writable(0);
</script>

<div class="flex px-2 justify-center items-center w-full h-full">
  <div class="flex-1 w-full flex items-center gap-1 overflow-x-scroll scroll-fade"
  on:scroll={() => { scrollAmount.set(scroller.scrollLeft); }}
  bind:this={scroller}>
    {#each $iconToolboxes as icon }
      <IconToolbox toolboxData={icon} scrollAmount={scrollAmount}/>
    {/each}
  </div>
  <div class="relative h-full w-full flex-1 flex items-center
  justify-self-center justify-center max-w-[min(50%_,_24rem)]">
    <h1 class="font-[Livvic] text-norbalt-100 font-bold delay-200 transition select-none
    overflow-ellipsis whitespace-nowrap overflow-clip mr-8"> {$title} </h1>
  </div>
  <div class="flex-1 w-full">
  </div>
</div>
