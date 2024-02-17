<script lang="ts">
  import SystemPropAmountDisplay from "../../../../components/systems-sidebar/system-prop-amount-display.svelte";
  import type { Configuration } from "../../../../entities/configuration";
  import ChevronIcon from "../../../../icons/chevron-icon.svelte";
  import TextField from "../../../../components/fields/text-field.svelte";
  import semver from "semver";
  import Tooltip from "../../../../components/common/tooltip.svelte";
  import CraterIcon from "../../../../icons/crater-icon.svelte";
  import CogMulticolorIcon from "../../../../icons/cog-multicolor-icon.svelte";
  import DuplicateIcon from "../../../../icons/duplicate-icon.svelte";
  import ConfirmCancelButton from "../confirm-cancel-button.svelte";
  import { storageManager } from "../../../../stores/storage-manager";
  import { selectedSystem } from "../../../../components/systems-sidebar/systems-stores";
  import { navigation } from "../../../../lib/navigation";
  import { currentProject } from "../../../../stores/projects-store";

  export let configuration : Configuration;
  export let startOpen;
  const { version, id } = configuration;

  let open = startOpen;
  $: projectName = $currentProject.name;
  $: chevronRotation = !open ? "-rotate-90" : "rotate-0";
  $: summary = configuration.getConfigurationSummary();
  $: invalid = $version && !semver.valid($version);

  let ref : HTMLElement;

  let hoveredOption = "";
  const setHoveredOption = (option : string) : () => void => {
    return () => {
      hoveredOption = option;
    };
  };

  let hasEdited = false;

  const saveVersion = async () : Promise<void> => {
    await storageManager.manager.updateVersion(configuration);
    hasEdited = false;
  };

  const cancelEdit = async () : Promise<void> => {
    await storageManager.manager.loadVersionsToStores($selectedSystem);
    hasEdited = false;
  };

  const navigateToConfig = () : void => {
    navigation.navigateTo(`/editor/system/${$selectedSystem}/configuration/${$id}`);
  };
</script>

<div class="mt-4 first:mt-0">
  <div class="flex h-8 flex-row items-center bg-norbalt-300 border rounded border-transparent hover:border-offWhite transition-all stroke-offWhite hover:stroke-white cursor-pointer"
    on:click={() => { open = !open; }}
  >
    <div class="transition-all ml-2">
      <ChevronIcon style="{chevronRotation} transition-all stroke-inherit w-3 h-3"/>
    </div>
    <div class="text-offWhite text-lg ml-3"> {$version} </div>
    <div class="flex-1"/> <!-- TODO Add save button here -->
    <div class="flex flex-row w-32 justify-around h-7 mr-3">
      <SystemPropAmountDisplay name="Schemas" count={summary.schemasCount} textColor={"text-roseRed-light"} fillColor={"fill-roseRed-light"}/>
      <SystemPropAmountDisplay name="Protocols" count={summary.protocolsCount} textColor={"text-crystalBlue-light"} fillColor={"fill-crystalBlue-light"}/>
      <SystemPropAmountDisplay name="Business Operations" count={summary.bopsCount} textColor={"text-ochreYellow-light"} fillColor={"fill-ochreYellow-light"}/>
    </div>
  </div>
  {#if open}
    <div class="w-[calc(100%_-_1rem)] ml-2"> <!-- body -->
      <div class="relative w-full">
        <TextField field={version} label={"Version number"} invalid={invalid} onChange={() => { hasEdited = true; }}/>
        <Tooltip visible={invalid} tooltipContent={"Version must be a valid SEMVER"} position="bottom"/>
      </div>
      <div class="flex flew-row w-full justify-between items-center mt-4 h-16">
        <div class="w-48 h-16 grid grid-cols-3 grid-rows-1 gap-2">
          <div bind:this={ref} class="bg-norbalt-300 rounded-lg transition-all hover:bg-norbalt-400 cursor-pointer flex justify-center items-center relative"
            on:mouseenter={setHoveredOption("crater")} on:mouseleave={setHoveredOption("")}
            on:click={() => configuration.download($projectName)}
          >
            <CraterIcon style="w-9 h-9"/>
            <Tooltip visible={hoveredOption === "crater"} tooltipContent={"Bundle your version"} position="bottom"/>
          </div>
          <div class="bg-norbalt-300 rounded-lg transition-all hover:bg-norbalt-400 cursor-pointer flex justify-center items-center relative"
            on:mouseenter={setHoveredOption("config")} on:mouseleave={setHoveredOption("")}
            on:click={navigateToConfig}
          >
            <CogMulticolorIcon style="w-9 h-9" />
            <Tooltip visible={hoveredOption === "config"} tooltipContent={"Edit this version"} position="bottom"/>
          </div>
          <div class="bg-norbalt-300 rounded-lg transition-all hover:bg-norbalt-400 cursor-not-allowed flex justify-center items-center relative"
            on:mouseenter={setHoveredOption("duplicate")} on:mouseleave={setHoveredOption("")}

          >
            <DuplicateIcon style="w-9 h-9 stroke-white fill-white" />
            <Tooltip visible={hoveredOption === "duplicate"} tooltipContent={"Duplicate this version - UPCOMING"} position="bottom"/>
          </div>
        </div>
        {#if hasEdited}
          <div class="w-[2px] h-full rounded bg-norbalt-100 mx-4"/>
          <div class="flex flex-col justify-center items-center mr-4">
            <p class="mb-2 text-offWhite"> There are Unsaved changes </p>
            <ConfirmCancelButton onCancel={cancelEdit} onConfirm={saveVersion}/>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>