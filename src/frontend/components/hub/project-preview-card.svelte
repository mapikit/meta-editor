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
        }

        const value = new Date().valueOf()-project.updatedAt.valueOf();
        for(const key in values) {
            let div =  value / values[key];
            if( div > 1) return `${Math.floor(div)} ${key}${div >= 2 ? "s" : ""} ago` 
        }
        return "moments ago";
    }
</script>

<div aria-hidden="true" class="card">
    <div class="name">{project.projectName}</div>
    <div class="versionsInfo">{project.versions.length} Versions</div>
    <div class="updateInfo">Edited {getRelevantUpdateInfo()}</div>
</div>


<style lang="scss">
    .card {
        display: flex;
        flex-wrap: wrap;
        border-radius: 8pt;
        background-color: #21264aFF;
        width: 200pt;
        height: fit-content;
        padding-bottom: 10pt;
    }

    .name {
        width: 100%;
        margin-top: 6pt;
        margin-left: 13pt;
        height: fit-content;
        font-size: 16pt;
        font-weight: 600;
    }

    .versionsInfo {
        position: relative;
        display: inline-flex;
        margin-left: 17pt;
        color: rgba(166, 168, 192, 0.54375);
        height: fit-content;
    }

    .updateInfo {
        margin-top: 16pt;
        width: 100%;
        height: fit-content;
        margin-left: 17pt;
        margin-right: 17pt;
        background-color: #151537;
        border-radius: 4pt;
        padding-left: 6pt;
        color: rgba(166, 168, 192, 0.54375);
    }
</style>