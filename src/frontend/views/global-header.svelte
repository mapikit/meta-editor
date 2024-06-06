<script lang="ts">
  import { slide } from "svelte/transition";
  import { globalHeaderStore } from "../../entities/stores/global-header-store";


  let { title } = globalHeaderStore;

  let toolbarOpen = false;
</script>

<div class="flex justify-center items-center w-full h-full">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="relative h-full flex items-center justify-center group w-fit max-w-[min(50%_,_24rem)]"
    on:mouseenter={() => { toolbarOpen = true; }}
    on:mouseleave={() => { toolbarOpen = false; }}
  >
    <h1 class="text-2xl font-[Livvic] text-norbalt-100 font-bold
    group-hover:text-white transition select-none
    overflow-ellipsis whitespace-nowrap overflow-clip"> {$title} </h1>
    <div class="absolute w-14 bottom-1 h-[3px] rounded bg-norbalt-200
    transition-all group-hover:translate-y-1"/>
    {#if toolbarOpen}
      <div class="absolute bg-norbalt-300 shadow rounded p-2 outline outline-2 outline-norbalt-200
      bottom-[-0.5rem] translate-y-full mt-2 h-16"
      transition:slide={{ axis: "y", duration: 150, delay: 150 }}>
        a
      </div>
    {/if}
  </div>
</div>
