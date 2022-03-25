<script lang="ts">
import { onMount } from "svelte";
  export let hidden = false;

let ref : HTMLDivElement;
export let trashRect : DOMRect;
onMount(() => {
  trashRect = ref.getBoundingClientRect();
});
</script>

<div class="trash" bind:this={ref} style="right: {hidden ? "10px" : "18.5%"};">
  TRASH
</div>

<style lang="scss">
  .trash {
    transition: right 250ms ease-in-out;
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