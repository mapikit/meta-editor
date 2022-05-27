<script lang="ts">
import type { BopsConstant } from "meta-system/dist/src/configuration/business-operations/business-operations-type";

  import type { Writable } from "svelte/store";
  import DropdownIcon from "../dropdown-icon.svelte";
  import AddConstantCard from "../module-components/add-constant-card.svelte";
  import StoreConstant from "../module-components/store-constant.svelte";

  let addingConst = false;
  export let bopConstants : Writable<BopsConstant[]>

</script>

<div class="constantStore">
  <div class="list">
    {#each $bopConstants as constant}
      <div class="listItem"><StoreConstant constant={constant}/></div>
    {/each}
  </div>
  {#if addingConst}
    <div class="addCard"><AddConstantCard bind:editing={addingConst}/></div>
  {/if}
  <div class="addButton" on:click={() => { addingConst = true; }}><div class="addIcon"><DropdownIcon/></div></div>
</div>

<svelte:window on:keydown={(e) => { if(e.key === "Escape") addingConst = false; } } />
<style lang="scss">
  .constantStore {
    position: relative;
    height: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
    width: 100%;
  }

  .list {
    display: flex;
    max-width: 100%;
    flex-direction: column;
    align-items: center;
  }

  .addCard {
    position: absolute;
    height: 300px;
    margin-left: 2px;
    margin-right: 2px;
    width: calc(100%  - 4px);
    bottom: 0;
    margin-bottom: 3px;
    z-index: 1;
  }

  .addButton {
    position: absolute;
    width: 90%;
    height: 8%;
    bottom: 8px;
    left: 5%;
    display: flex;
    justify-self: center;
    border-radius: 6px;
    background-color: #515151;
    justify-content: center;
    outline: dashed gray 3px;
  }

  .addButton:hover {
    background-color: rgb(102, 102, 102);
  }

  .addIcon {
    stroke: whitesmoke;
    height: 10%;
    width: 10%;
    margin-top: 2%;
  }
</style>