<script lang="ts">
	import ProjectCard from "../components/projects/project-card.svelte";
	import { FileSystemController } from "../../entities/controllers/file-system-controller.js";
	import projectsStore from "../../entities/stores/projects-store.js";
	import CreateButton from "../components/projects/create-button.svelte";
	import ImportButton from "../components/projects/import-button.svelte";
    // windowWasInjected(window);
    // let projects : Writable<Array<ProjectConfigType>> = writable([]);
    // window.fileApi.getAvailableProjects().then(avProjs => {
    //     avProjs.forEach(async projName => {
    //         console.log(projName);
    //         windowWasInjected(window);
    //         const prj = await window.fileApi.getProjectInfo(projName);
    //         console.log(prj);
    //         $projects.push(prj);
    //         console.log($projects);
    //     });
    // })

    const projects = projectsStore.items;
</script>

<div class="projectsView">
<span class="title">Your Projects</span><CreateButton/><ImportButton/><br>
    {#await FileSystemController.loadAllProjects()}
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

    .projectsContainer {
    }

    .projectsView {
    }

</style>

