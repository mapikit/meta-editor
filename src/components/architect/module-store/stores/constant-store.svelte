<script lang="ts">

  import { bopStore } from "../../../../stores/bop-store";
  import DropdownIcon from "../dropdown-icon.svelte";
  import AddConstantCard from "../module-components/add-constant-card.svelte";
  import StoreConstant from "../module-components/store-constant.svelte";

  let addingConst = false;

</script>

<div class="constantStore">
  <div class="list">
    {#each $bopStore.constants as constant}
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
    display: grid;
    grid-template-rows: 93% 7%;
    grid-template-columns: 100%;
    height: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
    width: 100%;
  }

  .list {
    display: flex;
    flex-direction: column;
    align-items: center;
    grid-row: 1;
  }

  .listItem {
    margin-top: 3px;
  }
  .addCard {
    position: absolute;
    height: 300px;
    margin-left: 2px;
    margin-right: 2px;
    width: calc(100%  - 4px);
    bottom: 0;
    margin-bottom: 3px;
    background-color: white;
  }

  .addButton {
    width: 90%;
    height: 88%;
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