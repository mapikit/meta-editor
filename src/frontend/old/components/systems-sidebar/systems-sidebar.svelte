<script lang="ts">
  import { availableProjects } from "../../stores/projects-store";
  import { Project } from "../../entities/project";
  import { guideText } from "../../stores/layout-tabs-store";
  import SidebarSystem from "./sidebar-system.svelte";
  import { storageManager } from "../../stores/storage-manager";

  guideText.set("Select or create a system to work with.");
</script>

<div class="h-full w-80 ml-16">
  <div class="w-full font-sans flex flex-row mt-9 justify-between items-center">
    <p class="text-2xl font-semibold"> Projects </p>
    <div class="bg-norbalt-200 px-4 py-1 rounded font-medium text-offWhite transition-all hover:text-white shadow-light cursor-pointer"
      on:click={() => storageManager.manager.createProject(Project.createNewProject())}
    > Create New </div> 
  </div>
  {#if $availableProjects.length === 0 }
    <p class="text-center text-norbalt-100 text-base font-sans"> You're not in a Project yet. </p>
  {/if}
  {#each $availableProjects as system}
    <SidebarSystem system="{system}" />
  {/each}
</div>
