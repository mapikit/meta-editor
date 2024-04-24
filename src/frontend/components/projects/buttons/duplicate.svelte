<script lang="ts">
    import { ProjectVersionInfo } from "../../../../common/types/project-config-type";
    import { FileSystemController } from "../../../../entities/controllers/file-system-controller";
    import { Project } from "../../../../entities/models/project";
    import AddItem from "../../../icons/new-icons/add-item.svelte";
    export let version : ProjectVersionInfo;
    export let parentProject : Project;

    function duplicateVersion () : void {
      FileSystemController.versionsController.duplicate(version, parentProject);
      //TODO update after duplication
    }
</script>

<span class="inline-flex bg-norbalt-400 rounded-md h-full p-1 aspect-square" on:click={duplicateVersion} aria-hidden="true">
    <span class="stroke-offWhite stroke w-full h-full hover:stroke-ochreYellow"><AddItem/></span>
</span>
