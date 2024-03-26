<script lang="ts">
  import { DockMutations } from "../../../../entities/mutations/dock-mutations";
  import { SubdivisionStore } from "../../../../entities/stores/dock-subdivision-store";

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

<button class="w-4 h-4 bg-norbalt-200 rounded-sm"
  on:click={() => { open = !open; }}
/>
{#if open}
  <div class="bg-norbalt-300 absolute mt-6 rounded-sm shadow-md flex flex-col overflow-hidden">
    <button class="w-full text-center text-offWhite
      hover:text-white transition-all px-3 pt-2 pb-1 hover:bg-norbalt-200"
      on:click={() => { DockMutations.divide(parent, id); open = false; }} > New Panel </button>
    <button class="w-full text-center text-offWhite
      hover:text-white transition-all px-3 pb-2 pt-1 hover:bg-norbalt-200"
      on:click={() => { DockMutations.exclude(parent, id); open = false; }} > Delete Panel </button>
  </div>
{/if}
