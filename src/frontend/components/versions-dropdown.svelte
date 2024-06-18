<script lang="ts">
  import { clickOutside } from "../lib/click-outside-directive";
  import { CaretDown, Archive, TreeStructure, PlusSquare, ArrowSquareUp } from "phosphor-svelte";
  import { ProjectStore, ProjectVersionInfoStore } from "../../entities/stores/projects-store";
  import EditableTextField from "./text-fields/editable-text-field.svelte";
  import { fly } from "svelte/transition";
  import CardButton from "./buttons/card-button.svelte";
  import { ProjectsController } from "../../entities/controllers/projects-controller";
  import { SystemConfigurationController } from "../../entities/controllers/system-configuration-controller";
  import { navigation } from "../lib/navigation";
  import { getContext, onDestroy, onMount } from "svelte";
  import { Unsubscriber, Writable, get, writable } from "svelte/store";

  export let parentProject : ProjectStore;
  let expanded = false;
  let { versions } = parentProject;

  let scrollCompensation : Writable<number> = (getContext("scroll-compensation") ?? writable(0)) as Writable<number>;
  let styleScrollCompensation = "transform: translateY(0)";
  let latestVersion : Writable<ProjectVersionInfoStore> = writable(null);
  let otherVersions : Writable<ProjectVersionInfoStore[]> = writable([]);

  const navigateToVersion = async (versionId : string) : Promise<void> => {
    const project = parentProject.toEntity();
    await ProjectsController.selectProject(project);
    await SystemConfigurationController.loadConfiguration(project, versionId);
    SystemConfigurationController.loadConfigurationIntoView(versionId);
    navigation.navigateTo(project.getVersionNavigationPath(versionId));
  };

  const cloneToNewVersion = async (version : ProjectVersionInfoStore) : Promise<void> => {
    const project = parentProject.toEntity();
    await SystemConfigurationController.duplicateConfiguration(project, version.identifier);
  };

  const archiveVersion = async (version : ProjectVersionInfoStore) : Promise<void> => {
    const project = parentProject.toEntity();
    await SystemConfigurationController.archive(project, version.identifier);
  };

  $: {
    styleScrollCompensation = `transform: translateY(-${$scrollCompensation}px)`;
  }

  let scrollCompensationUnsub : Unsubscriber;
  let versionsUnsub : Unsubscriber;
  onMount(() => {
    // This makes so we don't get an ugly out of place dropdown when
    // scrolling with the dropdown open
    scrollCompensationUnsub = scrollCompensation.subscribe(() =>  { expanded = false; });
    versionsUnsub = versions.subscribe((v) => {
      otherVersions.set(v.slice(0, -1).reverse());
      latestVersion.set(v[v.length-1]);
    });
  });
  onDestroy(() => { scrollCompensationUnsub(); versionsUnsub(); });
</script>

<div class="relative text-offWhite h-fit w-fit"
  use:clickOutside
  on:click_outside={() => { expanded = false; }}>
  <button aria-hidden="true" class="cursor-pointer select-none inline-flex items-center"
  on:click={()=>{ expanded=!expanded; }}>
    {$versions.length} Version{$versions.length > 1 || $versions.length === 0 ? "s" : ""}
    <CaretDown class="{expanded ? "rotate-180": ""} transition-transform ml-2 translate-y-[1px]"/>
  </button>
  {#if expanded}
    <div class="absolute w-0 h-0 top-full left-0">
    <div class="fixed flex flex-col p-2 rounded-md max-h-48 overflow-y-scroll border-norbalt-200
    border-2 bg-norbalt-300 z-40 w-max shadow"
    style="{styleScrollCompensation}"
    transition:fly={{ x:0, y: -25, duration: 260 }}
    >
      {#if $versions.length === 0}
        <div class="flex flex-col items-center">
          <span class="text-offWhite text-lg"> Empty Project. </span>
          <CardButton class="px-2 mt-2" hoverColor="green" noOutline
            clickFunction={async () => {
              await ProjectsController.createNewNextVersion(parentProject.toEntity());
            }}
          >
            Create a version <PlusSquare class="ml-2"/>
          </CardButton>
        </div>
      {/if}
      {#if $latestVersion !== null && $latestVersion !== undefined} {#key $latestVersion.identifier}
        <div class="items-center p-1 flex w-fit">
          <EditableTextField class="w-40 h-7 rounded-none rounded-l"
          text={get($latestVersion.name)}
          onFinishEdit={async (value) => {
            $latestVersion.name.set(value);
            await SystemConfigurationController
              .saveFromVersionInfo(parentProject.toEntity(), $latestVersion.toEntity());
            const now = new Date(Date.now());
            parentProject.updatedAt.set(now);
            $latestVersion.updatedAt.set(now.toISOString());
            await ProjectsController.save(parentProject.toEntity());
          }}/>
          <span class="border-norbalt-400 w-24 text-center border-2 rounded-r
            pl-1.5 pr-2 whitespace-nowrap select-none cursor-default"> @ {get($latestVersion.version)} </span>
          <div class="inline-flex h-7 space-x-1.5 ml-4">
            <CardButton class="w-7" hoverColor="green" noOutline
            clickFunction={async () => { await navigateToVersion($latestVersion.identifier); }}>
              <TreeStructure class="w-5 h-5" />
            </CardButton>
            <CardButton class="w-7" hoverColor="blue" noOutline
            clickFunction={async () => { await cloneToNewVersion($latestVersion); }}>
              <ArrowSquareUp class="w-6 h-6" /> </CardButton>
            <CardButton class="w-7" hoverColor="red" noOutline
            clickFunction={async () => { await archiveVersion($latestVersion); }}>
              <Archive class="w-6 h-6" /> </CardButton>
            </div>
        </div>
      {/key}{/if}
      {#if $otherVersions.length > 0}
        <div class="border-t-2 border-norbalt-100 w-[calc(100%_-_0.5rem)]
        h-0.5 my-2 mx-1 text-offWhite font-bold"> </div>
      {/if}
      <div>
      {#each $otherVersions as version}
        <div class="items-center mx-1 px-2 flex w-fit border-2 border-norbalt-400 first:rounded-t
          last:rounded-b border-b-0 last:border-b-2 border-t-2 first:border-t-2
          text-offWhite hover:text-white select-none whitespace-nowrap">
          <span class="w-36 overflow-ellipsis overflow-hidden cursor-default whitespace-nowrap"> {version.name} </span>
          <span class="border-l-2 border-norbalt-400 w-24 text-center"> @ {version.version} </span>
        </div>
      {/each}
      </div>
    </div>
    </div>
  {/if}
</div>

