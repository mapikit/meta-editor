<script lang="ts">
  import { get } from "svelte/store";
  import VersionsDropdown from "../../components/versions-dropdown.svelte";
  import { Clock } from "phosphor-svelte";
  import { formatDistance } from "date-fns";
  import EditableToggleTextField from "../../components/text-fields/editable-toggle-text-field.svelte";
  import { ProjectStore } from "../../../entities/stores/projects-store";
  import ProjectCardActions from "./project-card-actions.svelte";

  export let project : ProjectStore;

  const projectName = project.projectName;

  function getRelevantUpdateInfo () : string {
    return formatDistance(get(project.updatedAt), new Date(Date.now()), { addSuffix: true });
  }
</script>

<div aria-hidden="true" class="relative flex flex-col rounded-lg
  bg-card-gradient w-64 h-fit pb-4 pt-3 px-5 ml-6 mt-6
  outline-2 outline-transparent outline pointer-events-auto">
  <EditableToggleTextField text={projectName} onSubmit={() => console.log("Save")}
    class="text-xl font-bold"
  />
  <VersionsDropdown bind:parentProject={project}/>
  <div class="inline-flex items-center mt-2 px-2 h-fit w-fit bg-norbalt-400 rounded pl-2 text-offWhite">
    Edited {getRelevantUpdateInfo()} <Clock class="ml-1" />
  </div>
  <ProjectCardActions project={project}/>
</div>
