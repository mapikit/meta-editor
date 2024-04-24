<script lang="ts">
    import { ProjectVersionInfo } from "../../../../common/types/project-config-type";
    import { FileSystemController } from "../../../../entities/controllers/file-system-controller";
    import { Project } from "../../../../entities/models/project";
    import Trash from "../../../icons/new-icons/trash.svelte";
    export let version : ProjectVersionInfo;
    export let parentProject : Project;


    function deleteVersionOrProject () : void {
      // TODO Alert before deletion
      if(!version) FileSystemController.projectsController.archive(parentProject);
      else FileSystemController.versionsController.archive(parentProject, version);
    }
</script>

<span class="inline-flex bg-norbalt-400 rounded-md h-full p-1 aspect-square" on:click={deleteVersionOrProject} aria-hidden="true">
<!-- <img aria-hidden="true" class="trash" src="src/frontend/components/projects/trash.svg" alt="trash"/> -->
<span class="stroke-offWhite stroke w-full h-full translate-y-0.5 hover:stroke-roseRed"><Trash/></span>
</span>
