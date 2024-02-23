<script lang="ts">
    import { ProjectConfigType, ProjectVersionInfo } from "../../../../common/types/project-config-type";
    import { FileSystemController } from "../../../../entities/controllers/file-system-controller";
    import { Project } from "../../../../entities/models/project";
    import AddItem from "../../../icons/new-icons/add-item.svelte";
    export let version : ProjectVersionInfo;
    export let parentProject : Project;

    function duplicateVersion () : void {
        FileSystemController.duplicateConfiguration(version, parentProject);
        //TODO update after duplication
    }
</script>

<span class="background" on:click={duplicateVersion} aria-hidden="true">
    <span class="squares"><AddItem/></span>
</span>

<style lang="scss">
    .squares {
        stroke-width: 1.3;
        stroke: rgba(166, 168, 192, 0.54375);;
        width: 100%;
        height: 100%;
    }

    .squares:hover {
        stroke: rgb(207, 207, 1);
    }

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