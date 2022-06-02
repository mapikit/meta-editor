<script lang="ts">
  import { fly } from "svelte/transition";
  import Tooltip from "../common/tooltip.svelte";
  
  export let deleteButtonHovered = false;
  export let deleteAction : Function;

  $: buttonColor = deleteButtonHovered ? "#ff4b5b" : "#2c2c44";

</script>

<div
  style={`background-color: ${buttonColor}`}
  transition:fly={{ duration: 200, x: -10 }}
  on:mouseenter="{() => { deleteButtonHovered = true; }}"
  on:mouseleave="{() => { deleteButtonHovered = false; }}"
  class="edit-button" on:click={deleteAction}>
  <div class="edit-icon">
    X
  </div>
  <div class="tooltip-holder">
    <Tooltip visible={deleteButtonHovered} tooltipContent={"Delete Entity"} position={"right"}/>
  </div>
</div>

<style lang="scss">
  .edit-button {
    cursor: pointer;
    position: absolute;
    left: calc(100% + 12px);
    --height: 48px;
    top: calc(80% - var(--height));
    border-radius: calc(var(--height) / 2);
    height: var(--height);
    width: 48px;
    text-align: center;
    justify-self: center;
    transition: 200ms all;

    .tooltip-holder {
      display: block;
      margin-left: 50px;
      width: var(--height);
      height: var(--height);
    }

    &:hover {
      box-shadow: 0 0 12px -6px #e6e6fe;
    }

    .edit-icon {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>