<script lang="ts">
	import ProjectCard from "../components/projects/project-card.svelte";
	import { FileSystemController } from "../../entities/controllers/file-system-controller.js";
	import projectsStore from "../../entities/stores/projects-store.js";
	import CreateButton from "../components/projects/create-button.svelte";
	import ImportButton from "../components/projects/import-button.svelte";

    const projects = projectsStore.items;
</script>

<div class="projectsView">
<span class="title">Your Projects</span><CreateButton/><ImportButton/><br>
    {#await FileSystemController.load.projects()}
        Loading Projects...
    {:then result}
        <div class="projectsContainer">
            {#each $projects as project}
                    <ProjectCard project={project}/>
                {/each}
        </div>
    {/await}
</div>

<style lang="scss">
    .title {
        font-size: 24pt;
        font-weight: 600;
        padding-left: 17pt;
    }
</style>

