<script lang="ts">
    import { ProjectVersionInfo } from "../../../../common/types/project-config-type";
    import { FileSystemController } from "../../../../entities/controllers/file-system-controller";
    import { Project } from "../../../../entities/models/project";
    import Trash from "../../../icons/new-icons/trash.svelte";
    export let version : ProjectVersionInfo;
    export let parentProject : Project;
    
    
    function deleteVersionOrProject () : void {
        // TODO Alert before deletion
        if(!version) FileSystemController.removeProject(parentProject);
        else FileSystemController.removeConfiguration(parentProject, version);
    }
</script>

<span class="background" on:click={deleteVersionOrProject} aria-hidden="true">
<!-- <img aria-hidden="true" class="trash" src="src/frontend/components/projects/trash.svg" alt="trash"/> -->
<span class="trash"><Trash/></span>
</span>

<style lang="scss">
    .trash {
        stroke-width: 1.5;
        stroke: rgba(166, 168, 192, 0.54375);;
        width: 100%;
        height: 100%;
        transform: translateY(1pt);
    }

    .trash:hover { stroke: rgba(249, 88, 121, 1); }

    .background {
        display: inline-flex;
        background-color: #151537;
        border-radius: 4pt;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 4pt;
        aspect-ratio: 1 / 1;
    }
</style>