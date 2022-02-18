<script lang="ts">
import type { ExtendedJsonTypes } from "meta-system/dist/src/common/types/json-types";


  import { fly } from "svelte/transition"
import { bopStore } from "../../../../stores/bop-store";
  import { availableComponents, possibleConstTypes } from "./type-inputs/inputs-map";


  export let editing : boolean;

  let name : string;
  let value : unknown;
  let type : ExtendedJsonTypes;

  function addConstant () {
    if(name === "" || name === undefined) return window.alert("Name required")
    // Check name uniqueness
    bopStore.update(bop => {
      bop.constants.push({
        name,
        type,
        value,
      });
      return bop;
    })
    editing = false;
  }
  

</script>


<div class="constantAddCard"
  transition:fly={{y:300}}>
  <input type="text" placeholder="Contant Name" style="width: 50%;" bind:value={name}/>&nbsp;<label for="types">type: </label>
  <select bind:value={type}>
    {#each possibleConstTypes as type}
      <option value={type}>{type[0].toUpperCase()+type.slice(1)}</option>
    {/each}
  </select>&nbsp;<input type="button" value="add" on:click={addConstant}><br>
  <svelte:component this={availableComponents[type]} bind:value/>
</div>

<style lang="scss">
  .constantAddCard {
    width: 100%;
    height: 100%;
    background-color: red;
    border-radius: 8px;
    overflow-y: scroll;
  }
</style>