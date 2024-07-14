<script lang="ts">
  import { DotsThree } from "phosphor-svelte";
  import { DockMutations } from "../../../../entities/mutations/dock-mutations";
  import { SubdivisionStore } from "../../../../entities/stores/dock-subdivision-store";
  import { fly } from "svelte/transition";

  let open = false;
  let id;

  export let parent : SubdivisionStore;
  export let currentElement : SubdivisionStore;

  $: {
    id = currentElement?._id;
  }
  // This component could potentially, later on, have parameters for options
  // This would allow plugins to create their panels and specify them.
</script>

<button class="w-5 h-5 bg-transparent rounded-sm transition-all
hover:bg-norbalt-200 text-offWhite hover:text-white text-bold"
  on:click={() => { open = !open; }}
>
  <DotsThree class="w-5 h-5"/>
</button>

{#if open}
  <div class="bg-norbalt-300 absolute mt-6 rounded shadow-md flex flex-col overflow-hidden z-10"
  transition:fly={{ x: 0, y: -12, duration: 150 }}>
    <button class="w-full text-center text-offWhite
      hover:text-white transition-all px-3 pt-2 pb-1 hover:bg-norbalt-200"
      on:click={() => { DockMutations.divide(parent, id); open = false; }} > New Panel </button>
    <button class="w-full text-center text-offWhite
      hover:text-white transition-all px-3 pb-2 pt-1 hover:bg-norbalt-200"
      on:click={() => { DockMutations.exclude(parent, id); open = false; }} > Delete Panel </button>
  </div>
{/if}
