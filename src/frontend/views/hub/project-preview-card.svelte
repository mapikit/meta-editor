<script lang="ts">
	import { writable } from "svelte/store";
	import { Project } from "../../../entities/models/project.js";

    export let project : Project;

    const editingName = writable(false);
    const projectName = writable(project.projectName);


    function getRelevantUpdateInfo () : string {
      const values = {
        year: 31556952000,
        month: 2629746000,
        day: 86400000,
        hour: 3600000,
        minute: 60000,
      };

      const value = new Date().valueOf()-project.updatedAt.valueOf();
      for(const key in values) {
        let div =  value / values[key];
        if(div > 1) return `${Math.floor(div)} ${key}${div >= 2 ? "s" : ""} ago`;
      }
      return "moments ago";
    }
</script>

<div aria-hidden="true" class="flex flex-wrap rounded-md bg-norbalt-300 w-64 h-fit pb-4">
    <div class="w-full mt-2 ml-5 h-fit text-xl font-bold">{project.projectName}</div>
    <div class="relative inline-flex ml-5 text-offWhite h-fit">{project.versions.length} Versions</div>
    <div class="mt-6 w-full h-fit mx-5 bg-norbalt-400 rounded-md pl-2 text-offWhite">Edited {getRelevantUpdateInfo()}</div>
</div>
