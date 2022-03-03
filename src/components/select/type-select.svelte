<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { typeColors } from "../../common/styles/type-colors";
  import { possibleConstTypes } from "../architect/module-store/module-components/type-inputs/inputs-map";  

  let contents = possibleConstTypes;
  let selecting = false;


  export let simplyfied = false;
  export let value = undefined;

  const dispatch = createEventDispatcher<{ change: { value: any, index : number }}>();

  function handleChange (index : number, nValue : any) {
    value = nValue;
    selecting = false;
    dispatch("change", { value, index })
  }

</script>

<div class="select">
  <div class="selection" on:click={ () => selecting = !selecting }>
    {#if value !== undefined}
      {#if !simplyfied}
        {value}
      {/if}
      <div style="display: inline; color: {typeColors[value]};">●</div>
    {:else}
      Select Type
    {/if}
  </div>
  {#if selecting}
      <div class="options">
        {#each contents as option, index}
          <div on:click={() => handleChange(index, option)}>
            {option}&nbsp;<span style="color: {typeColors[option]};">●</span>
          </div>
        {/each}
      </div>
  {/if}
</div>

<style lang="scss">
  .select {
    display: inline-grid;
    justify-content: center;
    grid-template-rows: min-content min-content;
    transition: all 2s ease-in-out;
  }

  .selection {
    border: solid 1px black;
    width: 100%;
    padding: 5px;
    margin: 3px;
    user-select: none;
    position: relative;
    background-color: gray;
    border-radius: 10px;
  }

  .options {
    z-index: 1;
    padding: 5px;
    cursor: default;
    display: inline-block;
    background-color: darkblue;
    border-radius: 10px;
    position: absolute;
    top: 2pc;
  }


</style>