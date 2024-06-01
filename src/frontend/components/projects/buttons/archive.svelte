<script lang="ts">
    import { ProjectVersionInfo } from "../../../../common/types/serializables/project-config-type";
    import { ProjectsController } from "../../../../entities/controllers/projects-controller";
    import { SystemConfigurationController } from "../../../../entities/controllers/system-configuration-controller";
    import { Project } from "../../../../entities/models/project";
    import Trash from "../../../icons/new-icons/trash.svelte";
    export let version : ProjectVersionInfo;
    export let parentProject : Project;


    async function deleteVersionOrProject () : Promise<void> {
      // TODO Alert before archive
      if(!version) await ProjectsController.archiveProject(parentProject);
      else await SystemConfigurationController.archive(parentProject, version.identifier);
    }
</script>

<span class="inline-flex bg-norbalt-400 rounded-md h-full p-1 aspect-square" on:click={deleteVersionOrProject} aria-hidden="true">
<!-- <img aria-hidden="true" class="trash" src="src/frontend/components/projects/trash.svg" alt="trash"/> -->
<span class="stroke-offWhite stroke w-full h-full translate-y-0.5 hover:stroke-roseRed"><Trash/></span>
</span>
