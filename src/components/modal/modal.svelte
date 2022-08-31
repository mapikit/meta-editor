<script lang="ts">
  import { writable } from "svelte/store";
  import { fade } from "svelte/transition";

  let open = writable(true);

  export const openModal = () : void => {
    open.set(true);
  };

  export const closeModal = () : void => {
    open.set(false);
  };
</script>

{#if $open}
<div transition:fade="{{ "duration": 160 }}" class="w-full h-full fixed z-50 top-0 left-0 flex justify-center items-center bg-norbalt-500 bg-opacity-80 backdrop-blur" on:click="{closeModal}">
  <slot></slot>
</div>
{/if}