<script lang="ts">
  import { onMount, SvelteComponent } from "svelte";
  import InternalStore from "./module-store/stores/internal-store.svelte";
  import StoreTab from "./module-store/store-tab.svelte";
  import SchemaStore from "./module-store/stores/schema-store.svelte";
  import ConstantStore from "./module-store/stores/constant-store.svelte";
  import ExternalStore from "./module-store/stores/external-store.svelte";
  import BopsStore from "./module-store/stores/bops-store.svelte";
  import ProtocolsFunctionsStore from "./module-store/stores/protocols-functions-store.svelte";
  import type { FunctionDefinition } from "@meta-system/meta-function-helper";
  import { getProtocolModules } from "./module-store/helpers/get-protocol-modules";
  import { systemStore } from "../../stores/system-store";
  import { getExternalModules } from "./module-store/helpers/get-external-modules";
  import type { Writable } from "svelte/store";
  import type { BopsConstant } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import type { UIBusinessOperation } from "../../entities/business-operation";
  
  
  export let hidden = true;
  export let currentBop : UIBusinessOperation;
  let locked = false;
  let internalLock = false;
  let clientWidth = 0;
  let activity : NodeJS.Timeout;

  interface TabInfo {
    component : typeof SvelteComponent;
    iconURI : string;
    title : string;
    contentRequestPromise ?: Promise<Record<string, FunctionDefinition[]>>
  }

  const tabsInfo : Array<TabInfo> = [
    { component: InternalStore, iconURI: "internal_modules_v1.png", title: "Internal Modules" },
    { component: ExternalStore, iconURI: "external_modules_v1.png", title: "External Modules", contentRequestPromise: getExternalModules() },
    { component: SchemaStore, iconURI: "schemaFunctions_v1.png", title: "Schema Modules" },
    { component: ProtocolsFunctionsStore, iconURI: "Protocols_v1.png", title: "Protocols Modules", contentRequestPromise: getProtocolModules($systemStore) },
    { component: BopsStore, iconURI: "businessOperations_v1.png", title: "BOps Modules" },
    { component: ConstantStore, iconURI: "constants_v1.png", title: "Constants" },
    { component: undefined, iconURI: "variables_v1.png", title: "Variables" },
  ]

  const tabsRef : Array<HTMLDivElement> = [];
  onMount(() => {
    tabsRef[0].style.backgroundColor = "#7035fb";
  });

  function handleMouseOver () {
    if(activity !== undefined) clearTimeout(activity)
    hidden = false
  }

  function handleMouseOut () {
    if(!(locked || internalLock)) {
      activity = setTimeout(() => hidden = true, 2000)
    }
  }

  function handleTabClick(tab : TabInfo, index : number) {
    tabsRef.forEach(tab => { tab.style.backgroundColor = ""; })
    tabsRef[index].style.backgroundColor = "#7035fb";
    selected = tab
  }

  function handleLock () { locked = !locked; }

  function onInternalLockUpdate(_lock : boolean) {
    if(!(internalLock || locked)) activity = setTimeout(() => hidden = true, 2000)
  }

  $: onInternalLockUpdate(internalLock);

  let selected : TabInfo = tabsInfo[0];
  let searchValue : string = "";
  // 
</script>



<div id="store"
  style="right: {hidden ? -clientWidth : 10}px;"
  on:mouseover={handleMouseOver}
  on:mouseleave={handleMouseOut}
  on:focus={() => {}}
>
  <div class="storeName"><span 
    class="lockIcon"
    style="background-color: {locked ? "red" : "green"};"
    on:click={handleLock}
    >L</span><span class="title">{selected.title}</span></div>
  <div class="tabs">
    {#each tabsInfo as tab, index}
      <div on:click={() => handleTabClick(tab, index)}>
        <StoreTab bind:ref={tabsRef[tabsRef.length]}>
          <img src="/static/achitectect-module-store/{tab.iconURI}" alt=""/></StoreTab></div>
    {/each}
  </div>
  <div class="storeBody" bind:clientWidth>
    <div class="search">
      <span class="searchBar">L<input class="searchBox" type="text" bind:value={searchValue}><div on:click={() => searchValue = ""}>X</div></span>
    </div>
    <div class="selectedStore">
      <svelte:component 
        this={selected.component}
        bind:storeLocked={internalLock}
        search={searchValue}
        modules={selected.contentRequestPromise}
        bind:bopModules={currentBop.configuration}
        bind:bopConstants={currentBop.constants}
        />
    </div>
  </div>
</div>

<style>
  #store {
    z-index: 2;
    position: absolute;
    display: grid;
    grid-template-columns: min-content auto;
    grid-template-rows: min-content 100%;
    transition: right 250ms ease-in-out;
    top: 10px;
    width: 20%;
    height: calc(100% - 40px);
    border-radius: 7px;
  }


  .storeName {
    display: grid;
    grid-template-columns: min-content auto;;
    grid-row: 1;
    grid-column-start: 1;
    grid-column-end: 3;
    border-radius: 7px 7px 0 0;
    background-color: #7035fb;
    font-size: 110%;
    top: 0;
    color: white;
  }

  .lockIcon {
    width: 20px;
    height: 20px;
    border-radius: 6px 0 0 0;
    grid-column: 1;
    justify-self: left;
    user-select: none;
  }

  .title {
    grid-column: 2;
    width: 20px;
    height: 20px;
    width: 100%;
    text-justify: center;
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