<script lang="ts">
  import { clickOutside } from "../lib/click-outside-directive";
  import { CaretDown, Archive, TreeStructure, CopySimple, PlusSquare } from "phosphor-svelte";
  import { ProjectStore } from "../../entities/stores/projects-store";
  import EditableTextField from "./text-fields/editable-text-field.svelte";
  import { fly } from "svelte/transition";
  import CardButton from "./buttons/card-button.svelte";
  import { ProjectsController } from "../../entities/controllers/projects-controller";
  import { SystemConfigurationController } from "../../entities/controllers/system-configuration-controller";

  export let parentProject : ProjectStore;
  let versionsStore = parentProject.versions;
  let expanded = false;
  let { versions } = parentProject;
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
    <div class="absolute flexbox p-2 rounded-md left-0 top-full border-norbalt-200
    border-2 bg-norbalt-300 z-40 w-max shadow"
    transition:fly={{ x:0, y: -25, duration: 260 }}
    >
      {#if $versionsStore.length === 0}
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
      {#each $versionsStore as version}
      <div class="items-center p-1 inline-flex w-fit">
        <EditableTextField class="w-14 h-7"
        bind:text={version.version}
        onFinishEdit={async () => {
          await SystemConfigurationController.updateFromVersionInfo(parentProject.toEntity(), version);
          const now = new Date(Date.now());
          parentProject.updatedAt.set(now);
          version.updatedAt = now.toISOString();
          await ProjectsController.update(parentProject.toEntity());
        }}/>
        <div class="inline-flex h-7 space-x-1.5 ml-4">
          <CardButton class="w-7" hoverColor="green" noOutline> <TreeStructure class="w-5 h-5" /> </CardButton>
          <CardButton class="w-7" hoverColor="yellow" noOutline> <CopySimple class="w-6 h-6" /> </CardButton>
          <CardButton class="w-7" hoverColor="red" noOutline> <Archive class="w-6 h-6" /> </CardButton>
          </div>
      </div>
      {/each}
    </div>
  {/if}
</div>

