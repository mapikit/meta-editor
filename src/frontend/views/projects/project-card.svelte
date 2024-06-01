<script lang="ts">
	import { get, writable } from "svelte/store";
	import Cube from "./buttons/edit.svelte";
	import Squares from "./buttons/duplicate.svelte";
	import Archive from "./buttons/archive.svelte";
  import VersionsDropdown from "../../components/versions-dropdown.svelte";
  import { Pencil } from "phosphor-svelte";
  import { formatDistance } from "date-fns";
  import ActiveEditableTextField from "../../components/text-fields/active-editable-text-field.svelte";
  import { ProjectStore } from "../../../entities/stores/projects-store";
  import ProjectCardActions from "./project-card-actions.svelte";

  export let project : ProjectStore;

  const editingName = writable(false);
  const projectName = project.projectName;

  let latestVersion = get(project.versions).sort((a,b) =>
    b.createdAt.localeCompare(a.createdAt) || // Sort by date
      b.version.localeCompare(a.version), // If dates are equal, sort by version
  )[0];


  function getRelevantUpdateInfo () : string {
    return formatDistance(get(project.updatedAt), new Date(Date.now()), { addSuffix: true });
  }

  function editName () : void {
    editingName.set(!$editingName);
  }
</script>

<div aria-hidden="true" class="relative flex flex-col rounded-lg
  bg-card-gradient w-64 h-fit pb-4 pt-3 px-5
  outline-2 outline-transparent outline">
  <div class="inline-flex w-full h-fit text-xl font-semibold">
    <ActiveEditableTextField  editing={editingName} text={projectName} onSubmit={() => console.log("Save")}/>
    <span class="ml-1 mt-1 hover:text-offWhite" on:click={editName} aria-hidden="true"><Pencil/></span>
  </div>
  <div class="relative inline-flex text-offWhite h-fit">
    {get(project.versions).length} Versions <VersionsDropdown bind:parentProject={project}/>
  </div>
  <div class="mt-6 px-2 h-fit w-fit bg-norbalt-400 rounded pl-2 text-offWhite">
    Edited {getRelevantUpdateInfo()}
  </div>
  <ProjectCardActions project={project}/>
</div>
