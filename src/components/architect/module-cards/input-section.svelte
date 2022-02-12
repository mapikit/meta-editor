<script lang="ts">
import { typeColors } from "../../../common/styles/type-colors";

  import type { ModuleCard } from "../../../common/types/module-card";
  import { selectedNob } from "../../../stores/connection-stores";
  import { solveConnection } from "../helpers/solve-connection";


  export let name : string;
  export let parentInfo : ModuleCard;
  
  let nob : HTMLSpanElement;

  function getNob() : void {
    selectedNob.update((current) => {
      return solveConnection(current, {
        parentCard: parentInfo,
        nob,
        property: name,
        nobType: "input",
        propertyType: parentInfo.info.input[name].type
      }
    )})
  }
</script>

<style lang="scss">
  .nob {
    cursor: default;
    padding: 0 5px 3px 5px;
    margin-left: 4px;
    background-color: rgb(94, 93, 93);
    border-radius: 5px 0 0 5px;
    transition-duration: 125ms;
  }
  .nob:hover {
    background-color: lightgray;
    transition-duration: 125ms;
  }
  .text {
    cursor: default;
    margin: 2px 0px 0 0px;
    padding: 0 7px 3px 3px;
    border-radius: 0 5px 5px 0;
    background-color: rgb(94, 93, 93);
  }
  .total {
    user-select: none;
    width: min-content;
    margin: 6px 0 0 0;
  }
</style>

<div class="total" ><span 
    class="nob" id="InputNob"
    style="color: {typeColors[parentInfo.info.input[name].type]}" 
    on:click={getNob}
    bind:this={nob}
  >●</span><span class="text">{name}</span>
</div>