<script lang="ts">
  import type { BopsConstant } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import { writable } from "svelte/store";
import HeaderLinks from "../../../../header-links.svelte";
  import { availableComponents, possibleConstTypes } from "./inputs-map";


  type Write = Array<Omit<BopsConstant, "name">>
  let array = writable<Write>([]);

  let type = "none" as any;

  function addItem (event : MouseEvent) {
    array.update(arr => {
      arr.push({ type, value: undefined });
      return arr;
    });
    console.log(type, $array);
    console.log(type, value);
  }
  let value = [];
  array.subscribe(arr =>  value = arr.map(item => item.value));
  export { value };

</script>


<div class="array">
  {#if type === "none"}
    <label for="types"></label>
    <select bind:value={type}>
      <option value="" disabled selected hidden>Set Type</option>
      {#each possibleConstTypes.filter(type => type !== "array") as type}
        <option value={type}>{type[0].toUpperCase()+type.slice(1)}</option>
      {/each}
    </select><br>
  {:else}
    {#each $array as item}
      <div><svelte:component this={availableComponents[item.type]} bind:value={item.value}/></div><br>
    {/each}
    <div class="addButton" on:click={addItem}></div>
  {/if}
</div>

<svelte:window on:keydown={() => console.log(array)}/>

<style lang="scss">
  .array {
    border: solid black 2px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: gray;
  }

  .addButton {
    width: 60px;
    height: 30px;
    align-self: center;
    justify-self: flex-end;
    background-color: purple;
  }
</style>