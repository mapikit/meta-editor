<script lang="ts">
	import { get, writable } from "svelte/store";
	import Cube from "./buttons/edit.svelte";
	import Squares from "./buttons/duplicate.svelte";
	import Archive from "./buttons/archive.svelte";
  import EditableTextField from "../text-fields/active-editable-text-field.svelte";
  import VersionsDropdown from "./versions-dropdown.svelte";
  import { Pencil } from "phosphor-svelte";
  import { Project } from "../../../entities/stores/projects-store.js";
  import { formatDistance } from "date-fns";

  export let project : Project;

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

<div aria-hidden="true" class="flex flex-wrap m-3 first rounded-md bg-gradient-to-b
  from-norbalt-400 to-norbalt-300 w-64 h-fit pb-3">
  <div class="inline-flex w-full mt-2 ml-3 h-fit text-xl font-semibold">
    <EditableTextField  editing={editingName} text={projectName} onSubmit={() => console.log("Save")}/>
    <span class="ml-1 mt-1 hover:text-offWhite" on:click={editName} aria-hidden="true"><Pencil/></span>
  </div>
  <div class="relative inline-flex ml-5 text-offWhite h-fit">
    {get(project.versions).length} Versions <VersionsDropdown bind:parentProject={project}/>
  </div>
  <div class="w-full h-fit mx-5 bg-norbalt-400 rounded-md pl-1 text-offWhite mt-1">
    Edited {getRelevantUpdateInfo()}
  </div>
  <div class="inline-flex mt-3 mx-5 w-full h-9">
    <span><Cube version={latestVersion}/></span>
    <span class="ml-1"><Squares version={latestVersion} parentProject={project.toEntity()}/></span>
    <span class="mr-0 ml-auto"><Archive version={undefined} parentProject={project.toEntity()}/></span>
    <!-- Above should be changed to project -->
  </div>
</div>
