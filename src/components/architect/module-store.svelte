<script lang="ts">
  import { onMount } from "svelte";
  import InternalStore from "./module-store/stores/internal-store.svelte";
  import StoreTab from "./module-store/store-tab.svelte";
  import SchemaStore from "./module-store/stores/schema-store.svelte";
  import ConstantStore from "./module-store/stores/constant-store.svelte";
  import ExternalStore from "./module-store/stores/external-store.svelte";
  import BopsStore from "./module-store/stores/bops-store.svelte";
  import ProtocolsFunctionsStore from "./module-store/stores/protocols-functions-store.svelte";
  import { getProtocolModules } from "./module-store/helpers/get-protocol-modules";
  import { getExternalModules } from "./module-store/helpers/get-external-modules";
  import type { UIBusinessOperation } from "../../entities/business-operation";
  import { protocols } from "../../stores/configuration-store";
  import LockIcon from "../../icons/lock-icon.svelte";
  
  export let hidden = true;
  export let currentBop : UIBusinessOperation;
  type PossibleStores = "internal" | "external" | "schema" | "bops" | "protocols" | "constants" | "variables";
  type TabInfo = { iconURI : string; title : string; }
  type TabsInfo = Record<PossibleStores, TabInfo>;

  let selectedStore : PossibleStores = "internal";

  let locked = false;
  let internalLock = false;
  let activity : NodeJS.Timeout;

  const tabsInfo : TabsInfo = {
    internal: { iconURI: "internal_modules_v1.png", title: "Internal Modules" },
    external: { iconURI: "external_modules_v1.png", title: "External Modules" },
    schema: { iconURI: "schemaFunctions_v1.png", title: "Schema Modules" },
    protocols: { iconURI: "Protocols_v1.png", title: "Protocols Modules" },
    bops: { iconURI: "businessOperations_v1.png", title: "BOps Modules" },
    constants: { iconURI: "constants_v1.png", title: "Constants" },
    variables: { iconURI: "variables_v1.png", title: "Variables" },
  };

  const tabsRef : Array<HTMLDivElement> = [];
  onMount(() => {
    tabsRef[0].style.backgroundColor = "#7035fb";
  });

  function handleMouseOver () : void {
    if(activity !== undefined) clearTimeout(activity);
    hidden = false;
  }

  function handleMouseOut () : void {
    if(!(locked || internalLock)) {
      activity = setTimeout(() => { hidden = true, 2000; });
    }
  }

  function handleTabClick (tab : string, index : number) : void {
    selectedStore = tab as PossibleStores;
    tabsRef.forEach(tab => { tab.style.backgroundColor = ""; });
    tabsRef[index].style.backgroundColor = "#7035fb";
  }

  function handleLock () : void { locked = !locked; }

  function onInternalLockUpdate (_lock : boolean) : void {
    if(!(internalLock || locked)) activity = setTimeout(() => hidden = true, 2000);
  }

  $: onInternalLockUpdate(internalLock);
  $: lockedLockIconColor = locked ? "fill-ochreYellow hover:fill-ochreYellow-light border-ochreYellow"
    : "fill-offWhite hover:fill-white";

  let search = "";
</script>

<div
  class="absolute right-0 z-10 top-16 w-96 h-[calc(100%_-_32px_-_4rem)] flex flex-row"
  on:mouseover={handleMouseOver}
  on:mouseleave={handleMouseOut}
  on:focus={() => {}}
>
  <div class="h-full w-11 mr-3"> <!-- Sidebar (TOOLS and Lock) -->
    <div class="mb-3 h-10 bg-norbalt-200 cursor-pointer border-2 border-transparent hover:bg-norbalt-100 flex items-center justify-center rounded-md shadow-contrast transition-all {lockedLockIconColor}" on:click={handleLock}>
      <LockIcon locked="{locked}" style="fill-inherit h-5 w-5"/>
    </div>
    <div>
      {#each Object.keys(tabsInfo) as tab, index}
        <div on:click={() => handleTabClick(tab, index)}>
          <StoreTab bind:ref={tabsRef[tabsRef.length]} tooltip={tabsInfo[tab].title}>
            <img src="/achitectect-module-store/{tabsInfo[tab].iconURI}" alt=""/>
          </StoreTab>
        </div>
      {/each}
    </div>
  </div>
  <div>
    <div>
      <span><input type="text" bind:value={search}><div on:click={() => search = ""}>X</div></span>
    </div>
    <div>
      {#if selectedStore === "internal"} <InternalStore bind:storeLocked={internalLock} bind:search bopModules={currentBop.configuration}/> {/if}
      {#if selectedStore === "external"} <ExternalStore bind:storeLocked={internalLock} bind:search modules={getExternalModules()} bopModules={currentBop.configuration}/> {/if}
      {#if selectedStore === "bops"} <BopsStore bind:storeLocked={internalLock} bind:search bopModules={currentBop.configuration} /> {/if}
      {#if selectedStore === "schema"} <SchemaStore bind:storeLocked={internalLock} bind:search bopModules={currentBop.configuration} /> {/if}
      {#if selectedStore === "constants"} <ConstantStore bopModules={currentBop.configuration} bopConstants={currentBop.constants} /> {/if}
      {#if selectedStore === "variables"} <div></div> {/if}
      {#if selectedStore === "protocols"} <ProtocolsFunctionsStore bind:storeLocked={internalLock} bind:search modules={getProtocolModules($protocols)} /> {/if}
    </div>
  </div>
</div>
