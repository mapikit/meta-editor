<script lang="ts">
  import { selectedNob } from "../../../stores/connection-stores";
  import { solveConnection } from "../helpers/solve-connection";
  import type { ModuleCard } from "../../../common/types/module-card";
import { typeColors } from "../../../common/styles/type-colors";

  export let name : string;

  let nob : HTMLSpanElement;

  export let parentInfo : ModuleCard;

  function getNob() : void {
    selectedNob.update((current) => {
      return solveConnection(current, {
      parentCard: parentInfo,
      nob,
      property: name,
      nobType: "output",
      propertyType: parentInfo.info.output[name].type
    })})
  }
</script>

<style lang="scss">
  .nob {
    cursor: default;
    padding: 0 5px 3px 2px;
    background-color: rgb(94, 93, 93);
    border-radius: 0 5px 5px 0;
    transition-duration: 125ms;
  }
  .nob:hover {
    background-color: lightgray;
    transition-duration: 125ms;
  }
  .text {
    user-select: none;
    cursor: default;
    margin: 0 0 15px 0;
    padding: 0 2px 3px 7px;
    border-radius: 5px 0 0 5px;
    background-color: rgb(94, 93, 93);
  }

  .total {
    user-select: none;
    margin: 7px 0px 0px auto;
    margin-right: 3px;
    width: min-content;
  }
</style>

<div class="total"><span class="text">{name}</span><span 
    class="nob"
    style="color: {typeColors[parentInfo.info.output[name].type]}" 
    on:click={getNob}
    bind:this={nob}
  >●</span>
</div>