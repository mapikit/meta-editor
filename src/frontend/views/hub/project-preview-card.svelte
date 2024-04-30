<script lang="ts">
  import { 
    formatDistance } from "date-fns";
	import { Project } from "../../../entities/models/project.js";

    export let project : Project;

    function getRelevantUpdateInfo () : string {
      const now = new Date();
      return formatDistance(project.updatedAt, now, { addSuffix: true });
    }
</script>

<div aria-hidden="true" class="flex flex-wrap rounded-md bg-norbalt-300 w-64 h-fit pb-4">
    <div class="w-full mt-2 ml-5 h-fit text-xl font-bold">{project.projectName}</div>
    <div class="relative inline-flex ml-5 text-offWhite h-fit">{project.versions.length} Versions</div>
    <div class="mt-6 w-full h-fit mx-5 bg-norbalt-400 rounded-md pl-2 text-offWhite">Edited {getRelevantUpdateInfo()}</div>
</div>
