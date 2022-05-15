<script lang="ts">
  import { navigation } from "../../lib/navigation";
  import { fly } from "svelte/transition";
  import ToolsConfigIcon from "../common/icons/tools-config-icon.svelte";
  import Tooltip from "../common/tooltip.svelte";
  
  export let editButtonHovered = false;

  export let id : string;

  $: buttonColor = editButtonHovered ? "#3cf691" : "#2c2c44";

</script>

<div
  style={`background-color: ${buttonColor}`}
  transition:fly={{ duration: 200, x: -10 }}
  on:mouseenter="{() => { editButtonHovered = true; }}"
  on:mouseleave="{() => { editButtonHovered = false; }}"
  class="edit-button" on:click={() => { navigation.navigateAppendTo(`/${id}/edit`); }}>
  <div class="edit-icon">
    <ToolsConfigIcon iconColor="#575777" scale={1.3}/>
  </div>
  <div class="tooltip-holder">
    <Tooltip visible={editButtonHovered} tooltipContent={"Configure entity"} position={"right"}/>
  </div>
</div>

<style lang="scss">
  .edit-button {
    cursor: pointer;
    position: absolute;
    left: calc(100% + 12px);
    --height: 48px;
    top: calc(50% - var(--height));
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