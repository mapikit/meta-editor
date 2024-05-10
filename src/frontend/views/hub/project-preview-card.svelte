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

<div aria-hidden="true" class="flex flex-wrap rounded-lg
  bg-card-gradient w-64 h-fit pb-4 pt-3 hover:brightness-125 transition-all duration-150
  outline-2 outline-transparent outline hover:outline-norbalt-200">
    <div class="w-full ml-5 h-fit text-xl font-bold">{project.projectName}</div>
    <div class="relative inline-flex ml-5 mt-1 text-offWhite h-fit">{project.versions.length} Versions</div>
    <div class="mt-6 px-2 h-fit mx-5 bg-norbalt-400 rounded pl-2 text-offWhite">
      Edited {getRelevantUpdateInfo()}
    </div>
</div>
