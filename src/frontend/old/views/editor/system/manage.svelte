<script lang="ts">
  import { fly } from "svelte/transition";
  import { navigation } from "../../../lib/navigation";
  import { selectedSystem } from "../../../components/systems-sidebar/systems-stores";
  import { onDestroy, onMount } from "svelte";
  import ClipboardIcon from "../../../icons/clipboard-icon.svelte";
  import { currentProject } from "../../../stores/projects-store";
  import ChevronIcon from "../../../icons/chevron-icon.svelte";
  import ConfirmCancelButton from "./confirm-cancel-button.svelte";
  import TextField from "../../../components/fields/text-field.svelte";
  import { projectVersions } from "../../../stores/configuration-store";
  import { storageManager } from "../../../stores/storage-manager";
  import VersionItem from "./management/version-item.svelte";

  let loadingPromise : Promise<void> = Promise.resolve();
  let savingPromise : Promise<void> = Promise.resolve();
  let hasEdited = false;

  $: project = $currentProject;
  $: projectName = $currentProject.name;
  $: versions = $projectVersions;
  $: updateVersionsKey = $projectVersions && Date.now();

  const saveProjectData = async () : Promise<void> => {
    savingPromise = storageManager.manager.updateProject(project);
    await savingPromise;
    hasEdited = false;
  };

  const cancelEdit = async () : Promise<void> => {
    savingPromise = storageManager.manager.loadProjectsToStores();
    await savingPromise;
    hasEdited = false;
  };

  const createNewVersion = async () : Promise<void> => {
    await storageManager.manager.createVersion($selectedSystem);
  };

  let unWatcher = selectedSystem.subscribe(() => {
    if ($selectedSystem) {
      loadingPromise = storageManager.loadProjectVersions($selectedSystem);
    }
  });;

  onMount(() => {
    selectedSystem.set(navigation.currentPathParams["systemId"]);
  });

  onDestroy(unWatcher);
</script>

<title> System Management </title>
<div class="h-full w-full pl-7 py-6" in:fly|global={{ x: 150, duration: 250, delay: 250 }} out:fly|global={{ x: -150, duration: 250 }} >
  {#await loadingPromise}
    Loading Project Data
  {:then result}
  <div class="flex h-8 flex-row items-center"> <!-- title -->
    <ClipboardIcon fill="w-6 h-6 fill-white mr-2"/>
    <p class="text-2xl ml-2 font-semibold"> {$projectName}</p>
    <div class="w-16 ml-4 mr-4 bg-norbalt-100 rounded h-[2px]"/>
    <p class="text-offWhite"> Management </p>
  </div>
  
  <div class="w-[550px] flex flex-row justify-between mt-14">
    <p class="text-white font-bold text-xl italic"> {$projectName}'s Settings</p>
    {#if hasEdited}
      Unsaved Changes
      <ConfirmCancelButton onConfirm={saveProjectData} onCancel={cancelEdit}/>
    {/if}
  </div>

  <div class="flex flex-row">
  <div>
    <div class="flex flex-row w-full mt-4"> <!-- Card holder -->
      <div class="rounded bg-norbalt-200 p-3 px-5 border-transparent border w-[550px]">
        <div class="flex flex-row justify-between items-center text-lg font-semibold"> <!-- Information Section -->
          <ChevronIcon />
          <p class="ml-3">  Information </p>
          <div class="flex-1 ml-6 h-0.5 bg-norbalt-100"/>
        </div>
        <TextField field="{$currentProject.name}" label="Project Name" onChange={() => { hasEdited = true; }}/>
        <TextField field="{$currentProject.description}" label="Description" multiline={true} onChange={() => { hasEdited = true; }}/>
        <div class="flex flex-row justify-between items-center text-lg font-semibold mt-4"> <!-- Teams Section -->
          <ChevronIcon />
          <p class="ml-3"> Team Management </p>
          <div class="flex-1 ml-6 h-0.5 bg-norbalt-100"/>
        </div>
        <div class="text-xl text-center text-offWhite"> Coming soon! </div>
      </div>
    </div>
  </div>

  <div class="ml-8">
    <div class="flex flex-row w-full mt-4"> <!-- Card holder -->
      <div class="rounded bg-norbalt-200 p-3 px-5 border-transparent border w-[550px]">
        <div class="flex flex-row justify-between items-center text-lg font-semibold"> <!-- Information Section -->
          <ChevronIcon />
          <p class="ml-3">  Version Management </p>
          <div class="flex-1 ml-6 h-0.5 bg-norbalt-100"/>
          <div class="ml-4 rounded bg-norbalt-350 text-xs text-offWhite px-2 py-1 cursor-pointer hover:text-brightGreen transition-all"
            on:click={createNewVersion}
          > New Version </div>
        </div>
        <div class="w-full max-h-[650px] mt-3 overflow-y-auto">
        {#key updateVersionsKey}
          {#each versions as projectVersion, index }
            <VersionItem configuration={projectVersion} startOpen={index === 0}/>
          {/each}
        {/key}
        </div>
      </div>
    </div>
  </div>
  </div>
  {/await}
</div>