<script lang="ts">
  import { writable } from "svelte/store";
  import TypeSelect from "../../../../select/type-select.svelte";

  import { availableComponents } from "./inputs-map";
  import PlaceholderProp from "./placeholder-prop.svelte";

  let object = writable({});
  export const value = $object;

  let placeholder = undefined;

  object.subscribe(() => { placeholder = undefined; });

  function addProperty (event : MouseEvent) {
    placeholder = PlaceholderProp;
  }
</script>


<div class="obj">
  {#each Object.keys($object) as key}
    <div>{key}:<svelte:component this={availableComponents[$object[key].type]} bind:value={$object[key].value}/>
      <TypeSelect simplyfied={true} bind:value={$object[key].type} on:change={() => $object[key].value = undefined}/></div><br>
  {/each}
  <svelte:component this={placeholder} parentReference={object}/>
  <div class="addButton" on:click={addProperty}></div>
</div>

<svelte:window on:keydown={() => console.log($object)}/>

<style lang="scss">
  .obj {
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