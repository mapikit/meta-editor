<script lang="ts">
  import { selectedSystem } from "./systems-stores";
  import { guideText } from "../../stores/layout-tabs-store";
  import type { Project } from "../../entities/project";
  import { onDestroy } from "svelte";
  import { navigation } from "../../lib/navigation";
  import Selector from "../common/selector.svelte";
  import { availableConfigurations } from "../../stores/configuration-store";
  import { get } from "svelte/store";
  import SystemPropAmountDisplay from "./system-prop-amount-display.svelte";
  import CogSmall from "../../icons/cog-small.svelte";
import ClipboardIcon from "../../icons/clipboard-icon.svelte";
  
  export let system : Project;
  let collapsed = true;
  let name = system.name;
  let description = system.description;
  let id = system.id;
  let versions = $availableConfigurations.filter((elm) =>  get(elm.projectId) === $id);
  let selectedVersion = versions[0].version;
  let summary = system.getConfiguration().getConfigurationSummary(); // TODO get by selected config
  let currentVersion = versions[0];
  const pathStore = navigation.pathStore;

  const unsub = selectedSystem.subscribe((value) => {
    collapsed = !(value === $id);
  });

  onDestroy(unsub);

  const updateCollapsedStatus = () : void => {
    if (collapsed === true) {
      selectedSystem.set($id);
      guideText.set("Select one of the three icons to start configuring your system. "
        +"Hover to see more info about each one of them.");
    } else {
      if ($pathStore === "/mapibox") {
        selectedSystem.set("");
      }
      guideText.set("Select or create a system to work with");
    }
  };


</script>

<div class="bg-norbalt-200 shadow mt-10 first:mt-3 rounded-md px-3 pt-3 pb-4 border-[3px] border-transparent transition-all hover:border-norbalt-100 cursor-pointer"
  on:click="{updateCollapsedStatus}"
>
  <!-- <div class="{collapsed ? "chevron-collapse down" : "chevron-collapse"}"  on:click="{() => { collapsed = !collapsed; }}">
    <img src="/icon-chevron-up.svg" alt="chevron"/>
  </div> -->
  <div class="pl-6 pr-3">
    <!-- content here -->
    <div class="flex flex-row">
      <p class="font-sans font-medium text-lg"> {$name} </p>
    </div>
    <div class="text-offWhite mt-3 text-sm"
    >
      {$description}
    </div>
    {#if !collapsed}
      <div class="flex flex-row justify-between mt-3">
        <div class="bg-norbalt-300 px-4 py-1 rounded font-medium text-offWhite fill-offWhite transition-all hover:text-white hover:fill-white cursor-pointer ml-auto flex flex-row items-center">
          Manage
          <ClipboardIcon fill={"fill-inherit ml-2"}/>
        </div>
      </div>
      <div class="flex flex-row justify-between mt-3 items-center">
        <p class="text-offWhite text-base"> Versions </p>
        <div class="h-[2px] w-4/6 bg-norbalt-100" ></div>
      </div>
      <Selector bind:field={$selectedVersion} options={versions.map((elm) => get(elm.version))} />
      <div class="w-full text-offWhite text-xs mt-3">
        <div> Last Edit: <span class="float-right"> {get(currentVersion.updatedAt)} </span></div>
        <div class="mt-1"> Created At: <span class="float-right"> {get(currentVersion.createdAt)} </span></div>
      </div>
      <div class="flex flex-row justify-around mt-3">
        <div class="rounded bg-norbalt-300 flex w-4/6 flex-row justify-around h-7">
          <SystemPropAmountDisplay name="Schemas" count={summary.schemasCount} textColor={"text-roseRed-light"} fillColor={"fill-roseRed-light"}/>
          <SystemPropAmountDisplay name="Protocols" count={summary.protocolsCount} textColor={"text-crystalBlue-light"} fillColor={"fill-crystalBlue-light"}/>
          <SystemPropAmountDisplay name="Business Operations" count={summary.bopsCount} textColor={"text-ochreYellow-light"} fillColor={"fill-ochreYellow-light"}/>
        </div>
        <div class="rounded bg-norbalt-300 h-7 px-4 flex flex-col justify-center stroke-offWhite hover:stroke-white transition-all">
          <CogSmall stroke={"stroke-inherit"}/>
        </div>
      </div>
    {/if}
  </div>
</div>
