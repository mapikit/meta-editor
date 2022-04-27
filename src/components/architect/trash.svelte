<script lang="ts">
import { onMount } from "svelte";


let ref : HTMLDivElement;
export let trashRect : DOMRect;
onMount(() => {
  trashRect = ref.getBoundingClientRect();
});
</script>

<div class="trash" bind:this={ref}>
  TRASH
</div>

<style lang="scss">
  .trash {
    scale: 1;
    user-select: none;
    position: absolute;
    bottom: 10px;
    right: 20%;
    background-color: crimson;
    border-radius: 7px;
    padding: 10px 30px;
    z-index: 0;
  }
</style>