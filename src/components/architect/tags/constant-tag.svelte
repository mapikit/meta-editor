<script lang="ts">
  import type { BopsConstant } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import { typeColors } from "../../../common/styles/type-colors";
  import DropdownIcon from "../module-store/dropdown-icon.svelte";

  export let parentNob : HTMLSpanElement;
  export let config : BopsConstant;

  function removeTag () { parentNob.dispatchEvent(new Event("removeTag")) }
</script>

<div class="constantTag">
  <div class="removeIcon" on:click={removeTag}><DropdownIcon/></div>
  <span class="name">{config.name}&nbsp;</span><span 
    class="indicator" style="color: {typeColors[config.type]};"> ●</span>
</div>

<style lang="scss">
  .constantTag {
    background-color: #1a1616;
    position: absolute;
    top: 0px;
    display: flex;
    right: calc(100% - 28px);
    width: max-content;
    padding-right: 16px;
    padding-bottom: 3px;
    padding-left: 7px;
    border-radius: 10px 0 0 10px;
    clip-path: polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%);
  }

  .removeIcon {
    width: 10px;
    display: block;
    margin-right: 7px;
    stroke: white;
    transform-origin: center;
    transform: rotate(45deg);
  }

</style>