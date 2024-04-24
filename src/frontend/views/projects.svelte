<script lang="ts">
	import ProjectCard from "../components/projects/project-card.svelte";
	import { FileSystemController } from "../../entities/controllers/file-system-controller.js";
	import projectsStore from "../../entities/stores/projects-store.js";
	import CreateButton from "../components/projects/create-button.svelte";
	import ImportButton from "../components/projects/import-button.svelte";

    const projects = projectsStore.items;
</script>

<div>
<span class="text-4xl font-semibold pl-6">Your Projects</span><CreateButton/><ImportButton/><br>
    {#await FileSystemController.projectsController.loadAll()}
        Loading Projects...
    {:then result}
        <div class="flex flex-wrap">
            {#each $projects as project}
                    <ProjectCard project={project}/>
                {/each}
        </div>
    {/await}
</div>

