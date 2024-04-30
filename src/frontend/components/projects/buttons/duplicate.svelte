<script lang="ts">
    import { ProjectVersionInfo } from "../../../../common/types/project-config-type";
    import { FileSystemController } from "../../../../entities/controllers/file-system-controller";
    import { Project } from "../../../../entities/models/project";
    import AddItem from "../../../icons/new-icons/add-item.svelte";
    export let version : ProjectVersionInfo;
    export let parentProject : Project;

    async function duplicateVersion () : Promise<void> {
      await FileSystemController.versionsController.duplicate(version, parentProject);
      //TODO update after duplication
    }
</script>

<div class="inline-flex bg-norbalt-400 rounded-md h-full p-1 aspect-square" aria-hidden="true"
  on:click={duplicateVersion}>
    <span class="stroke-offWhite stroke w-full h-full hover:stroke-ochreYellow"><AddItem/></span>
</div>
