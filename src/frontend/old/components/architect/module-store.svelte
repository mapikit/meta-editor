<script lang="ts">
  import InternalStore from "./module-store/stores/internal-store.svelte";
  import StoreTab from "./module-store/store-tab.svelte";
  import SchemaStore from "./module-store/stores/schema-store.svelte";
  import ConstantStore from "./module-store/stores/constant-store.svelte";
  import ExternalStore from "./module-store/stores/external-store.svelte";
  import BopsStore from "./module-store/stores/bops-store.svelte";
  import ProtocolsFunctionsStore from "./module-store/stores/protocols-functions-store.svelte";
  import type { UIBusinessOperation } from "../../entities/business-operation";
  import { protocols } from "../../stores/configuration-store";
  import LockIcon from "../../icons/lock-icon.svelte";
  import { capitalize } from "../../common/helpers/capitalize";
  import { getContext } from "svelte";
  import StoreModal from "./module-store/store-modal.svelte";
  import type { ArchitectContext } from "src/entities/auxiliary-entities/architect-context";
import VariableStore from "./module-store/stores/variable-store .svelte";
import { storageManager } from "../../stores/storage-manager";
import type { Protocol } from "../../entities/protocol";
import { get } from "svelte/store";
import type { FunctionDefinition } from "@meta-system/meta-function-helper";
import type { StoreModuleInfo } from "../../common/types/store-module-info";
  
  export let currentBop : UIBusinessOperation;
  type PossibleStores = "internal" | "external" | "schema" | "bops" | "protocols" | "constants" | "variables";
  type TabInfo = { iconURI : string; title : string; }
  type TabsInfo = Record<PossibleStores, TabInfo>;
  const context = getContext<ArchitectContext>("architectContext");

  let { selectedStore, storeModalOpen, mouseOverStore, storeVisible } = context;

  let locked = false;
  let internalLock = false;

  const tabsInfo : TabsInfo = {
    internal: { iconURI: "internal_modules_v1.png", title: "Internal Modules" },
    external: { iconURI: "external_modules_v1.png", title: "External Modules" },
    schema: { iconURI: "schemaFunctions_v1.png", title: "Schema Modules" },
    protocols: { iconURI: "Protocols_v1.png", title: "Protocols Modules" },
    bops: { iconURI: "businessOperations_v1.png", title: "BOps Modules" },
    constants: { iconURI: "constants_v1.png", title: "Constants" },
    variables: { iconURI: "variables_v1.png", title: "Variables" },
  };

  const handleMouseEnter = () : void => {
    storeVisible.set(true);
  };

  const handleMouseLeave = () : void => {
    if (!locked) {
      storeVisible.set(false);
    }
  };

  const externalModules = {
    modules: storageManager.manager.getExternalModules(),
    refresh: () : void => { externalModules.modules =  storageManager.manager.getExternalModules(); },
  };

  function handleTabClick (tab : string) : void {
    selectedStore.set(tab);
  }

  function handleLock () : void { locked = !locked; }

  $: lockedLockIconColor = locked ? "fill-ochreYellow hover:fill-ochreYellow-light border-ochreYellow"
    : "fill-offWhite hover:fill-white";

  $: hiddenStoreStyles = !$storeVisible ? "-right-[calc(24rem_-_3.5rem)] delay-[1500ms]" : "right-0";

  let search = "";


  async function getProtocolModules (systemProtocols : Protocol[]) : Promise<Record<string, StoreModuleInfo[]>> {
    const definitions : Record<string, StoreModuleInfo[]> = {};
    for(const protocol of systemProtocols) {
      const protocolName = get(protocol.protocolName);
      const functions = protocol.definition.functionDefinitions;
      if(!(functions?.length > 0)) continue;
      definitions[protocolName] = (functions as FunctionDefinition[])
        .map(funct => ({ ...funct, protocolIdentifier: get(protocol.identifier) }));
    }
    return definitions;
  }

  const protocolModules = getProtocolModules($protocols);
</script>

<div
  class="absolute z-10 top-4 w-96 h-[calc(100%_-_32px)] flex flex-row transition-all duration-500 {hiddenStoreStyles}"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  id="store"
>
  <div class="w-11 h-fit mr-3 flex flex-col"> <!-- Sidebar (TOOLS and Lock) -->
    <div class="mb-3 h-10 bg-norbalt-200 cursor-pointer border-2 border-transparent hover:bg-norbalt-100 flex items-center justify-center rounded-md shadow transition-all {lockedLockIconColor}" on:click={handleLock}>
      <LockIcon locked="{locked}" style="fill-inherit h-5 w-5"/>
    </div>
    <div class="mb-3 bg-norbalt-200 cursor-pointer flex flex-col items-center justify-center rounded-md shadow transition-all">
      {#each Object.keys(tabsInfo) as tab, index}
        <div class="w-11 hover:bg-norbalt-100 bg-transparent first:rounded-t-md last:rounded-b-md h-10 stroke-offWhite fill-offWhite hover:stroke-white hover:fill-white transition-all" on:click={() => handleTabClick(tab, index)}>
          <StoreTab tab={tab} />
        </div>
      {/each}
    </div>
  </div>
  <div class="w-80 h-full rounded bg-norbalt-200 shadow overflow-hidden"
    on:mouseenter="{() => mouseOverStore.set(true)}"
    on:mouseleave="{() => mouseOverStore.set(false)}"
  > <!-- Body-->
    <div class="rounded-t bg-norbalt-100 text-lg font-bold pl-4 py-1"> {capitalize($selectedStore)} </div>
    <div class="px-4 pt-2 overflow-y-auto h-full pb-16">
      {#if $selectedStore === "internal"} <InternalStore bind:storeLocked={internalLock} bind:search bopModules={currentBop.configuration}/> {/if}
      {#if $selectedStore === "external"} <ExternalStore bind:storeLocked={internalLock} bind:search modules={externalModules.modules} refreshModules={externalModules.refresh} bopModules={currentBop.configuration}/> {/if}
      {#if $selectedStore === "bops"} <BopsStore bind:storeLocked={internalLock} bind:search bopModules={currentBop.configuration} /> {/if}
      {#if $selectedStore === "schema"} <SchemaStore bind:storeLocked={internalLock} bind:search bopModules={currentBop.configuration} /> {/if}
      {#if $selectedStore === "constants"} <ConstantStore /> {/if}
      {#if $selectedStore === "variables"} <VariableStore /> {/if}
      {#if $selectedStore === "protocols"} <ProtocolsFunctionsStore bind:search modules={protocolModules} /> {/if}
    </div>
  </div>
  {#if $storeModalOpen}
    <div class="bg-norbalt-350 rounded-md fixed w-80 bottom-4 right-2 h-72">
      <StoreModal />
    </div>
  {/if}

</div>
