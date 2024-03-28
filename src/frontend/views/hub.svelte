<script lang="ts">
    import { get } from "svelte/store";
    import { FileSystemController } from "../../entities/controllers/file-system-controller";
    import projectsStore from "../../entities/stores/projects-store";
    import ProjectPreviewCard from "../components/hub/project-preview-card.svelte";
    import MetaSystemIcon from "../components/hub/meta-system-icon.svelte";
    import { navigation } from "../lib/navigation";

    function navigateToProjects () {
        navigation.navigateTo("/projects")
    }
</script>

<div class="hub">
<div class="hubContent">
<span class="icon"><MetaSystemIcon/></span>
<div class="projects">
    <div class="projectsHeader">
        <div class="title">Recent Projects</div><span aria-hidden="true" class="allProjectsButton" on:click={navigateToProjects}>Open All Projects > </span>
    </div>
    <div class="projectsCardsSection">
        {#await FileSystemController.load.projects()}
        Loading Recent Projects...
        {:then _result}
            {#each get(projectsStore.items) as project}
                <ProjectPreviewCard project={project}/>
            {/each}
        {/await}
    </div>
</div>
<div class="plugins">
    <div class="title">Browse Plugins</div>
    <div class="pluginsCardsSection">
        Coming Soon...
    </div>
</div>
</div>
</div>

<style lang="scss">
    .hub {
        padding-top: 6%;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, rgba(12, 12, 38, 1) 0%,rgba(21, 21, 55, 1) 100%);
    }

    .hubContent {
        margin-left: 15%;
        margin-right: 15%;
        display: grid;
        flex-wrap: wrap;
        width: 70%;
    }

    .projectsHeader {
        display: inline-flex;
        width: 100%;
    }

    .allProjectsButton{
        background-color: #21264a;
        border-radius: 4pt;
        padding: 6pt;
        font-size: 12pt;
        font-weight: 700;
        color: rgba(166, 168, 192, 0.54375);
        user-select: none;
        margin-right: 0;
        margin-left: auto;
    }

    .allProjectsButton:hover {
        background-color: rgba(166, 168, 192, 0.24375);
    }

    .icon {
        justify-self: center;
        stroke-width: 1.5;
        height: 153pt;
        padding-bottom: 7%;
    }
    
    .title {
        font-size: 24px;
        color: rgba(236, 236, 254, 1);
        font-style: normal;
        font-size: 24px;
        font-weight: 600;
        line-height: 1.2;
        letter-spacing: 0px;
    }

    .projectsCardsSection {
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        padding-bottom: 17pt;
        padding-top: 7pt;
    }

    .projectsCardsSection :global(.card):not(:first-child) {
        margin-left: 10pt;
    }

    .pluginsCardsSection {
        color: rgba(166, 168, 192, 0.54375);
    }
</style> 
