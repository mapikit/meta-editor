<script lang="ts">
    import { get } from "svelte/store";
    import { FileSystemController } from "../../entities/controllers/file-system-controller";
    import projectsStore from "../../entities/stores/projects-store";
    import ProjectPreviewCard from "../components/hub/project-preview-card.svelte";
    import MetaSystemIcon from "../components/hub/meta-system-icon.svelte";
    import { navigation } from "../lib/navigation";

    function navigateToProjects () {
      navigation.navigateTo("/projects");
    }
</script>

<div class="pt-6 w-full h-full bg-gradient-to-b from-norbalt-600 to-norbalt-400">
<div class="grid flex-wrap w-5/6 mx-auto self-center">
<span class="justify-center stroke-2 h-60 pb-10"><MetaSystemIcon/></span>
<div>
    <div class="inline-flex w-full">
        <div class="text-3xl font-semibold text-white">Recent Projects</div>
        <span aria-hidden="true"
        class="bg-norbalt-400 rounded font-bold p-2 text-base text-w text-offWhite mr-0 ml-auto hover:bg-norbalt-300 select-none cursor-pointer" on:click={navigateToProjects}>Open All Projects > </span>
    </div>
    <div class="flex flex-nowrap w-full py-4 space-x-4">
        {#await FileSystemController.projectsController.loadAll()}
        Loading Recent Projects...
        {:then _result}
            {#each get(projectsStore.items) as project}
                <ProjectPreviewCard project={project}/>
            {/each}
        {/await}
    </div>
</div>
<div>
    <div class="text-3xl font-semibold text-white">Browse Plugins</div>
    <div class="text-offWhite">
        Coming Soon...
    </div>
</div>
</div>
</div>
