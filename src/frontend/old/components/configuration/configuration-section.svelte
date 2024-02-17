<script lang="ts">
  import { businessOperations,
    currentConfig,
    currentConfigId,
    CustomDerived,
    getBopById,
    getProtocolById,
    getSchemaById,
    protocols,
    schemas,
  } from "../../stores/configuration-store";
  import ChevronIcon from "../../icons/chevron-icon.svelte";
  import SystemPropIcon from "../common/system-prop-icon.svelte";
  import type { Schema } from "../../entities/schema";
  import type { Protocol } from "../../entities/protocol";
  import type { UIBusinessOperation } from "../../entities/business-operation";
  import { get } from "svelte/store";
  import StarIcon from "../../icons/star-icon.svelte";
  import LockIcon from "../../icons/lock-icon.svelte";
  import { navigation } from "../../lib/navigation";
  import { slide } from "svelte/transition";
  import { onDestroy, onMount } from "svelte";
  import { createBop, createProtocol, createSchema } from "./creation-functions";
  import { deleteBop, deleteProtocol, deleteSchema } from "./deletion-functions";
  import type { PropertyListEntry } from "../../common/types/property-list-entry";
  import { storageManager } from "../../stores/storage-manager";

  $: currentVersion = currentConfig;
  let unwatcher = navigation.currentPathParamsSubscribable.subscribe((params) => {
    if (params["configurationId"]) {
      currentConfigId.set(params["configurationId"]);
    }
  });

  onMount(() => {
    currentConfigId.set(navigation.currentPathParams["configurationId"]);
  });

  onDestroy(unwatcher);

  type PropTypes = "Schemas" | "Business Operations" | "Protocols";

  export let type : PropTypes = "Schemas";
  export let canDelete = true; // TODO change this to verify if version is locked

  let collapsed = false;

  const iconStyles : Record<PropTypes, string> = {
    "Schemas": "stroke-white fill-roseRed",
    "Business Operations": "stroke-white fill-ochreYellow",
    "Protocols": "stroke-white fill-crystalBlue",
  };

  $: deleteFunction =
    type === "Schemas" ? deleteSchema :
      type === "Business Operations" ? deleteBop :
        type === "Protocols" ? deleteProtocol :
          () : void => console.log(`Deletion for ${type} not yet implemented`);
  
  $: creationFunction =
    type === "Schemas" ? createSchema :
      type === "Business Operations" ? createBop :
        type === "Protocols" ? createProtocol :
          () : void => console.log(`Creation for ${type} not yet implemented`);

  $: linkName =
    type === "Schemas" ? "/schemas":
      type === "Business Operations" ? "/bops" :
        "/protocols";

  $: usedList = (type === "Schemas" ? $schemas : type === "Business Operations" ?  $businessOperations : $protocols)
    .map((item : Schema | Protocol | UIBusinessOperation) => item.getCardInfo($currentVersion));
  $: chevronStyle = collapsed ? "-rotate-90" : "";
  $: currentStyle = iconStyles[type];

  type EntitiesUnion = UIBusinessOperation & Schema & Protocol;
  function getItemStore (item : PropertyListEntry) : CustomDerived<UIBusinessOperation | Schema | Protocol> {
    switch (item.type) {
      case "BOp": return getBopById(item.id);
      case "Protocol": return getProtocolById(item.id);
      case "Schema": return getSchemaById(item.id);
    }
  }

  function getManagerUpdate (item : PropertyListEntry)
    : (versionId : string, item : UIBusinessOperation | Schema | Protocol) => Promise<void> {
    switch (item.type) {
      case "BOp": return storageManager.manager.updateBop;
      case "Protocol": return storageManager.manager.updateProtocol;
      case "Schema": return storageManager.manager.updateSchema;
    }
  }

  // async function updateProperty <Key extends keyof EntitiesUnion>
  // (key : Key, value : Serialized<EntitiesUnion[Key]>, item : PropertyListEntry) : Promise<void> {
  //   const versionId = get($currentVersion.id);
  //   const store = getItemStore(item);
  //   const itemValue = get(store);
  //   itemValue[key as string].set(value);
  //   store.set(itemValue);
  //   await getManagerUpdate(item)(versionId, itemValue);
  //   return;
  // }

  async function toggleProperty <Key extends keyof EntitiesUnion>
  (key : Key, item : PropertyListEntry) : Promise<void> {
    const versionId = get($currentVersion.id);
    const store = getItemStore(item);
    const itemValue = get(store);
    itemValue[key as string].set(!get(itemValue[key as string]));

    store.set(itemValue);
    await getManagerUpdate(item)(versionId, itemValue);
    return;
  }

  const navigateEdit = (item) : () => void => {
    if (navigation.currentPath.includes(linkName)) {
      const pathParams = navigation.currentPathParams;
      // eslint-disable-next-line max-len
      return (() => navigation.navigateTo(`/editor/system/${pathParams["systemId"]}/configuration/${pathParams["configurationId"]}${linkName}/${item.id}`));
    }
    return (() => navigation.navigateAppendTo(`/${linkName}/${item.id}`));
  };
</script>

<div>
  <div class="w-[calc(100%-86px)] flex flex-row mt-9 items-center">
    <div class="flex flex-row items-center select-none cursor-pointer"
      on:click="{() => { collapsed = !collapsed; }}">
      <div class="transition-all {chevronStyle}"> <ChevronIcon /> </div>
      <p class="ml-3 flex flex-row text-xl font-semibold"> <span class="mr-2 mt-0.5"> <SystemPropIcon type={type} iconStyle={currentStyle}/> </span> {type} </p>
    </div>
    <div class="ml-5 py-1 px-4 bg-norbalt-200 rounded text-offWhite cursor-pointer hover:bg-norbalt-100 hover:text-white transition-all"
      on:click="{() => creationFunction(get($currentVersion.id))}"
    > Create New </div> <!-- TODO: Add call to Back End here -->
    <div class="ml-6 flex-1 h-[calc(2px)] bg-norbalt-100"/>
  </div>
  <!-- Header -->
  <!-- List -->
  {#if !collapsed}
  <div class="overflow-x-auto flex flex-row items-center mt-5 w-full pb-2" transition:slide|global="{{ duration: 180 }}">
    {#each usedList as item}
      <div class="bg-norbalt-200 w-80 min-w-[20rem] p-2 px-4 rounded ml-6 first:ml-0 last:mr-10">
        <div class="flex flex-row justify-between items-center">
          <p class="text-lg font-semibold"> {get(item.name)} </p>
          <div > <StarIcon style="stroke-norbalt-100 fill-{get(item.starred) ? "white" : "transparent"}" on:click={() => toggleProperty("isStarred", item)} /> </div> <!-- Todo: call BE -->
        </div>
        <div>
          <p class="text-offWhite mt-3"> {get(item.description)} </p>
        </div>
        <div class="h-[2px] bg-norbalt-100 mt-2" />
        <div class="mt-3">
          {#each item.dataValues as dataInfo}
            <div class="flex flex-row justify-between text-offWhite">
              <p> {dataInfo.name}: </p>
              <p> {get(dataInfo.value)} </p>
            </div>
          {/each}
        </div>
        <div class="flex flex-row mt-2 justify-between">
          {#if !get(item.locked)}
            <div class="rounded bg-norbalt-300 px-3 py-1 cursor-pointer transition-all text-offWhite hover:text-white"
              on:click="{navigateEdit(item)}"
            > Edit </div>
          {:else}
            <div class="rounded bg-opacity-0 px-3 py-1 text-norbalt-100 ring-2 ring-inset ring-norbalt-100">
              Edit
            </div>
          {/if}
          {#if canDelete && !get(item.locked)}
            <div class="rounded bg-norbalt-300 px-3 py-1 ml-4 cursor-pointer transition-all text-offWhite hover:text-roseRed"
              on:click="{() => deleteFunction(get($currentVersion.id), item.id)}"
            > Delete </div>
          {:else}
            <div class="rounded bg-opacity-0 px-3 py-1 ml-4 text-norbalt-100 ring-2 ring-inset ring-norbalt-100"
              > Delete </div>
          {/if}
          <div class="rounded bg-norbalt-300 ml-auto h-8 px-2.5 flex flex-col justify-center {get(item.locked) ? "fill-ochreYellow" : "fill-offWhite"} hover:fill-ochreYellow-light transition-all cursor-pointer"
            on:click="{() => toggleProperty("isLocked", item)}"
          > <!-- TODO: Extract to self contained component to enable reactivity -->
            <LockIcon style={"fill-inherit h-6 w-3"} locked={get(item.locked)}/>
          </div>
        </div>
      </div>
    {/each}
  </div>
  {/if}
</div>