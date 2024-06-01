<script lang="ts">
	import ProjectCard from "../components/projects/project-card.svelte";
  import MetaSystemIcon from "../icons/meta-system-icon.svelte";
  import TextButton from "../components/text-button.svelte";
  import { navigation } from "../lib/navigation";
  import { ProjectsController } from "../../entities/controllers/projects-controller";
  import { projectsStore } from "../../entities/stores/projects-store";

  const projects = projectsStore.items;
</script>

<section class="flex flex-col items-center w-full">
  <div class="max-w-7xl w-full px-8 flex flex-col"> <!-- Content container-->
    <div class="flex flex-row mt-10 items-center">
      <button class="w-12 h-12 mb-1 stroke-norbalt-200 fill-norbalt-200" on:click={() => {navigation.navigateTo("/");}}>
        <MetaSystemIcon width={2} style="hover:stroke-norbalt-100 hover:fill-norbalt-100"/>
      </button>
      <h1 class="font-[Livvic] ml-6 text-3xl font-semibold" > Your Projects </h1>
      <TextButton text="Create" clickFunction={ProjectsController.createNewProject}/>
      <TextButton text="Import From Folder" lessMargin clickFunction={() => {}}/>
   </div>
    {#await ProjectsController.loadAllProjects()}
    Loading Projects...
    {:then result}
    <div class="flex flex-wrap -ml-3 mt-2">
      {#each $projects as project}
        <ProjectCard project={project}/>
      {/each}
    </div>
    {/await}
  </div>
</section>

