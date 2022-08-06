<script lang="ts">
  import { businessOperations, protocols, schemas } from "../../stores/configuration-store";
  import ChevronIcon from "../../icons/chevron-icon.svelte";
  import SystemPropIcon from "../common/system-prop-icon.svelte";
  import { Schema } from "../../entities/schema";
  import { Protocol } from "../../entities/protocol";
  import { UIBusinessOperation } from "../../entities/business-operation";
  import { get } from "svelte/store";
  import StarIcon from "../../icons/star-icon.svelte";
  import LockIcon from "../../icons/lock-icon.svelte";
  import { navigation } from "../../lib/navigation";

  type PropTypes = "Schemas" | "Business Operations" | "Protocols";

  export let type : PropTypes = "Schemas";

  let collapsed = false;

  const iconStyles : Record<PropTypes, string> = {
    "Schemas": "stroke-white fill-roseRed",
    "Business Operations": "stroke-white fill-ochreYellow",
    "Protocols": "stroke-white fill-crystalBlue",
  };

  $: creationFunction = type === "Schemas"
    ? Schema.createNewSchema
    : type === "Business Operations"
      ? UIBusinessOperation.createNewBOp
      : Protocol.createNewProtocol;

  $: linkName = type === "Schemas"
    ? "/schemas"
    : type === "Business Operations"
      ? "/bops"
      : "/protocols";
  $: schemaList = $schemas;
  $: bopsList = $businessOperations;
  $: protocolList = $protocols;

  $: usedList = (type === "Schemas" ? schemaList : type === "Business Operations" ? bopsList : protocolList)
    .map((item : Schema | Protocol | UIBusinessOperation) => item.getCardInfo());
  $: chevronStyle = collapsed ? "-rotate-90" : "";
  $: currentStyle = iconStyles[type];
</script>

<div>
  <div class="w-[calc(100%-86px)] flex flex-row mt-9 items-center">
    <div class="flex flex-row items-center select-none cursor-pointer"
      on:click="{() => { collapsed = !collapsed; }}">
      <div class="transition-all {chevronStyle}"> <ChevronIcon /> </div>
      <p class="ml-3 flex flex-row text-xl font-semibold"> <span class="mr-2 mt-0.5"> <SystemPropIcon type={type} iconStyle={currentStyle}/> </span> {type} </p>
    </div>
    <div class="ml-5 py-1 px-4 bg-norbalt-200 rounded text-offWhite cursor-pointer hover:bg-norbalt-100 hover:text-white transition-all"
      on:click="{creationFunction}"
    > Create New </div> <!-- TODO: Add call to Back End here -->
    <div class="ml-6 flex-1 h-[calc(2px)] bg-norbalt-100"/>
  </div>
  <!-- Header -->
  <!-- List -->
  {#if !collapsed}
  <div class="overflow-x-auto flex flex-row items-center mt-5 w-full">
    {#each usedList as item}
      <div class="bg-norbalt-200 w-80 min-w-[20rem] p-2 px-4 rounded ml-6 first:ml-0 last:mr-10">
        <div class="flex flex-row justify-between items-center">
          <p class="text-lg font-semibold"> {get(item.name)} </p>
          <div > <StarIcon style="stroke-norbalt-100 fill-transparent" /> </div> <!-- Todo: call BE -->
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
          <div class="rounded bg-norbalt-300 px-3 py-1 cursor-pointer transition-all text-offWhite hover:text-white"
            on:click="{() => { navigation.navigateAppendTo(`/${linkName}/${item.id}`);}}"
          > Edit </div>
          <div class="rounded bg-norbalt-300 h-8 px-2.5 flex flex-col justify-center {get(item.locked) ? "fill-ochreYellow" : "fill-offWhite"} hover:fill-ochreYellow-light transition-all cursor-pointer"
            on:click="{() => { item.locked.set(!get(item.locked)); }}"
          > <!-- TODO: Extract to self contained component to enable reactivity -->
            <LockIcon style={"fill-inherit h-6 w-3"} locked={get(item.locked)}/>
          </div>
        </div>
      </div>
    {/each}
  </div>
  {/if}
</div>