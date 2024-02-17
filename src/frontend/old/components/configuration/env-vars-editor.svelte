<script lang="ts">
  import InformationCircleIcon from "../../icons/information-circle-icon.svelte";
  import type { Configuration } from "../../entities/configuration";
  import Tooltip from "../../components/common/tooltip.svelte";
  import Vars from "./vars.svelte";
  import { writable } from "svelte/store";
  import { EnvironmentVariable } from "../../entities/environment-variable";
  import { storageManager } from "../../stores/storage-manager";

  export let configuration : Configuration;
  let editingIndex = writable(-1);

  let infoHovered = false;
  $: environmentVars = configuration?.envs ?? writable([]);

  const addNewVariable = () : void => {
    environmentVars.update((varsList) => {
      varsList.push(new EnvironmentVariable({ key: "", value: "" }));
      return varsList;
    });
    editingIndex.set($environmentVars.length -1);
  };

  const removeVar = async (ev : CustomEvent<EnvironmentVariable>) : Promise<void> => {
    configuration.removeEnv(ev.detail);
    await storageManager.manager.updateVersion(configuration);
  };

  let savingPromise : Promise<void> = Promise.resolve();
  const save = async () : Promise<void> => {
    savingPromise = storageManager.manager.updateVersion(configuration);
    await savingPromise;
  };

</script>

<div class="bg-norbalt-350 rounded-md ml-16 p-3 px-4">
  <div class="w-[500px] flex flex-row justify-between items-center">  <!-- title bar -->
    <p class="text-lg font-semibold text-white"> System-Wide Variables <span class="font-normal text-norbalt-100 ml-1"> ({$environmentVars.length}) </span> </p>
    <div class="h-0.5 w-1/3 bg-norbalt-100" />
    <div class="bg-norbalt-300 px-4 py-1 rounded font-medium text-offWhite fill-offWhite transition-all hover:text-white hover:bg-norbalt-200 cursor-pointer flex flex-row items-center"
      on:click={addNewVariable}
    >
      {#await savingPromise}
        Saving...
      {:then} 
        Create New
      {/await}
    </div>
    <div
      on:mouseenter="{() => { infoHovered = true; }}"
      on:mouseleave="{() => { infoHovered = false; }}"
      class="relative"
    >
      <InformationCircleIcon style="fill-offWhite stroke-offWhite hover:stroke-white hover:fill-white transition-all"/>
      <Tooltip position="top" tooltipContent="The values set here can be used in any Business Operation. These are their default values, and they can be set to a different value before downloading your configuration file." visible={infoHovered}/>
    </div>
  </div>
  <div class="w-full max-h-36 mt-4 overflow-y-auto">
    {#key $environmentVars.length} <!-- Ensures re-render upon removal of an env -->
      {#each $environmentVars as env, index }
        <Vars editingIndex={editingIndex} env={env} index={index} on:remove={removeVar} on:updateVersion={save}/>
      {/each}
    {/key}
  </div>
</div>