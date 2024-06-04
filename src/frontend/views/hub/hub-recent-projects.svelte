<script lang="ts">
  import { ProjectsController } from "../../../entities/controllers/projects-controller";
  import { projectsStore } from "../../../entities/stores/projects-store";
  import TextButton from "../../components/buttons/text-button.svelte";
  import { get } from "svelte/store";
  import ProjectPreviewCard from "./project-preview-card.svelte";
  import { navigation } from "../../lib/navigation";

  function navigateToProjects () : void {
    navigation.navigateTo("/projects");
  }

  let { items } = projectsStore;
</script>

<div class="w-full">
  <div class="flex w-full justify-start items-center">
    <div class="text-3xl font-semibold text-white font-[Livvic]">Recent Projects</div>
    <TextButton text={"Open Project List"} clickFunction={navigateToProjects}/>
  </div>
  <div class="flex flex-nowrap w-full max-w-full overflow-x-scroll pb-3 -mx-0.5 px-0.5 space-x-4 -mt-16 pt-20">
    {#await ProjectsController.loadAllProjects()}
    Loading Recent Projects...
    {:then}
      {#if $items.length == 0}
        <div class="text-offWhite inline-flex text-xl text-bold">
          No projects yet.
          <TextButton clickFunction={ProjectsController.createNewProject} text="Create your first" />
        </div>
      {:else}
        {#each $items.slice(0,5) as project}
          <ProjectPreviewCard projectStore={project}/>
        {/each}
      {/if}
    {/await}
  </div>
</div>
