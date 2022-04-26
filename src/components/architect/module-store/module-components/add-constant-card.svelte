<script lang="ts">
  import type { ExtendedJsonTypes } from "meta-system/dist/src/common/types/json-types";
  import { fly } from "svelte/transition";
  import { bopStore } from "../../../../stores/bop-store";
  import Select from "../../../select/type-select.svelte";
  import { availableComponents, possibleConstTypes } from "./type-inputs/inputs-map";


  export let editing : boolean;

  let name : string;
  let value : unknown;
  let type : ExtendedJsonTypes;

  function addConstant () {
    if(name === "" || name === undefined) return window.alert("Name required");
    if($bopStore.constants.find(cons => cons.name === name) !== undefined) return window.alert("Name must be unique");
    // Check name uniqueness
    bopStore.update(bop => {
      bop.constants.push({
        name,
        type,
        value,
      });
      return bop;
    });
    editing = false;
  }
  

</script>


<div class="constantAddCard"
  transition:fly={{ y:300 }}>
  <input type="text" placeholder="Constant Name" style="width: 50%;" bind:value={name}/>&nbsp;
  <Select bind:value={type} on:change={() => {value = undefined;}}/>
  <input type="button" value="add" on:click={addConstant}><br>
  <svelte:component this={availableComponents[type]} bind:value/>
</div>

<style lang="scss">

  .constantAddCard {
    width: 100%;
    height: 100%;
    background-color: red;
    border-radius: 8px;
    overflow-y: scroll;
    scrollbar-width: thin;
    scrollbar-color: blue;
  }
</style>