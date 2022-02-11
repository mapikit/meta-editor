<script lang="ts">
  import { onMount } from "svelte";
  import InternalStore from "./module-store/stores/internal-store.svelte";
  import StoreTab from "./module-store/store-tab.svelte";
  import SchemaStore from "./module-store/stores/schema-store.svelte";

  const tabsInfo : Array<[any, any, string]> = [
    [InternalStore, "internal_modules_v1.png", "Internal Modules"],
    [undefined, "external_modules_v1.png", "External Modules"],
    [SchemaStore, "schemaFunctions_v1.png", "Schema Modules"],
    [undefined, "Protocols_v1.png", "Protocols Modules"],
    [undefined, "businessOperations_v1.png", "BOps Modules"],
    [undefined, "constants_v1.png", "Constants"],
    [undefined, "variables_v1.png", "Variables"],
  ]

  const tabsRef : Array<HTMLDivElement> = [];
  onMount(() => {
    tabsRef[0].style.backgroundColor = "#7035fb"
  })

  async function handleClick(tab : [any, any, string],index : number) {
    tabsRef.forEach(tab => { tab.style.backgroundColor = ""; })
    tabsRef[index].style.backgroundColor = "#7035fb";
    selectedStore = tab[0];
    selectedName = tab[2];
  }

  let selectedStore = tabsInfo[0][0];
  let selectedName = tabsInfo[0][2];
  let searchValue : string = "";
</script>



<div class="store">
  <div class="storeName">{selectedName}</div>
  <div class="tabs">
    {#each tabsInfo as tab, index}
      <div on:click={() => handleClick(tab, index)}>
        <StoreTab bind:ref={tabsRef[tabsRef.length]}>
          <img src="../../../static/achitectect-module-store/{tab[1]}" alt=""/></StoreTab></div>
    {/each}
  </div>
  <div class="storeBody">
    <div class="search">
      <span class="searchBar">L<input class="searchBox" type="text" bind:value={searchValue}><div on:click={() => searchValue = ""}>X</div></span>
    </div>
    <div class="selectedStore"><svelte:component this={selectedStore} search={searchValue}/></div>
  </div>
</div>

<style>
  .store {
    z-index: 2;
    position: absolute;
    display: grid;
    grid-template-columns: min-content auto;
    grid-template-rows: min-content 100%;
    right: 10px;
    top: 10px;
    width: 20%;
    height: calc(100% - 40px);
    border-radius: 7px;
  }

  .storeName {
    grid-row: 1;
    grid-column-start: 1;
    grid-column-end: 3;
    border-radius: 7px 7px 0 0;
    background-color: #7035fb;
    font-size: 110%;
    top: 0;
    color: white;
  }

  .tabs {
    grid-row: 2;
    grid-column: 1;
    align-items: center;
    height: min-content;
    border-radius: 0 0 0 7px;
    background-color: #10101a;
  }

  .storeBody {
    grid-row: 2;
    grid-column: 2;
    display: grid;
    grid-template-rows: min-content auto;
    grid-template-columns: 1fr;
    height: 100%;
    background-color: #202031;
    border-radius: 0 0 7px 7px;
    padding-right: 3px;
  }

  .search {
    grid-column: 1;
    grid-row: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 3px;
    border-radius: 5px;
    background-color: #191928;
  }

  .searchBar {
    user-select: none;
    background-color: #13131f;
    display: flex;
    text-align: center;
    width: 70%;
    justify-content: center;
    border-radius: 5px;
    margin:  3px;
  }

  .searchBox {
    width: 70%;
    border: none;
    color: white;
    margin-left: 5px;
    outline: none;
    background-color: inherit;
  }

  

  .selectedStore {
    border-radius: 7px;
    grid-column: 1;
    grid-row: 2;
    height: 100%;
    width: calc(100% - 3px);
    overflow-y: hidden;
    margin-left: 3px;
  }
</style>