<script lang="ts">
  import { onMount } from "svelte";
  import InternalStore from "./module-store/internal-store.svelte";
  import StoreTab from "./module-store/store-tab.svelte";
  const tabsInfo : Array<[any, any, string]> = [
    [InternalStore, "1", "Internal Modules"],
    [undefined, "2", "External Modules"],
    [undefined, "3", "Schema Modules"],
    [undefined, "4", "Protocols Modules"],
    [undefined, "5", "BOps Modules"],
    [undefined, "6", "Constants"],
    [undefined, "7", "Variables"],
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
  <div class="storeBody">
    <div class="tabs">
      {#each tabsInfo as tab, index}
        <div on:click={() => handleClick(tab, index)}><StoreTab bind:ref={tabsRef[tabsRef.length]}>{tab[1]}</StoreTab></div>
      {/each}
    </div>
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
    right: 10px;
    top: 10px;
    width: 18%;
    height: calc(100% - 40px);
    background-color: #7035fb;
    border-radius: 7px;
  }

  .storeBody {
    z-index: 1;
    display: grid;
    grid-template-rows: 11% 87%;
    grid-template-columns: 13% auto;
    height: 100%;
    background-color: #10101a;
    border-radius: 8px;
    padding-right: 3px;
  }

  .tabs {
    grid-column-start: 1;
    grid-row-start: 1;
    grid-row-end: 3;
    display: grid;
    grid-template-rows: repeat(7, calc(100%/7));
    grid-template-columns: 100%;
    align-items: center;
    border-radius: 7px;
  }

  .search {
    grid-column: 2;
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

  .storeName {
    border-radius: 7px 7px 0 0;
    background-color: #7035fb;
    font-size: 110%;
    top: 0;
    color: white;
  }

  .selectedStore {
    border-radius: 7px;
    grid-column: 2;
    grid-row: 2;
    height: 100%;
    background-color: #202031;
  }
</style>