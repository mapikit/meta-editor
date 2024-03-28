<script lang="ts">
	import { writable } from "svelte/store";
	import { Project } from "../../../entities/models/project.js";
	import Cube from "./buttons/edit.svelte";
	import Squares from "./buttons/duplicate.svelte";
	import Archive from "./buttons/archive.svelte";
    import EditableTextField from "../common/active-editable-text-field.svelte";
    import VersionsDropdown from "./versions-dropdown.svelte";

    export let project : Project;

    const editingName = writable(false);
    const projectName = writable(project.projectName);

    let latestVersion = project.versions.sort((a,b) => 
        b.createdAt.localeCompare(a.createdAt) || // Sort by date
        b.version.localeCompare(a.version) // If dates are equal, sort by version
    )[0];


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

    function editName() : void {
        editingName.set(!$editingName);
    }
</script>

<div aria-hidden="true" class="card">
    <div class="name"><EditableTextField  editing={editingName} text={projectName} onFinishEdit={() => console.log("Save")}/><img class="pencil" aria-hidden="true" on:click={editName} alt="Edit" src="src/frontend/components/projects/pencil.svg" /></div>
    <div class="versionsInfo">{project.versions.length} Versions <VersionsDropdown bind:parentProject={project}/></div>
    <div class="updateInfo">Edited {getRelevantUpdateInfo()}</div>
    <div class="buttons">
        <span><Cube version={latestVersion}/></span>
        <span class="left-button"><Squares version={latestVersion} parentProject={project}/></span>
        <span class="right-button"><Archive version={undefined} parentProject={project}/></span> 
        <!-- Above should be changed to project -->
    </div>
</div>


<style lang="scss">
    .buttons {
        display: inline-flex;
        margin-top: 10pt;
        margin-left: 17pt;
        margin-right: 17pt;
        width: 100%;
        height: 32pt;
    }

    .left-button {
        margin-left: 4pt;
    }

    .right-button {
        margin-right: 0;
        margin-left: auto;
    }

    .card {
        display: flex;
        flex-wrap: wrap;
        margin: 20px;
        border-radius: 8pt;
        background: linear-gradient(to bottom, rgba(21, 21, 55, 1) 0%,rgba(33, 38, 74, 1) 100%);
        width: 200pt;
        height: fit-content;
        padding-bottom: 10pt;
    }

    .pencil {
        display: inline;
        margin-left: 6pt;
        margin-bottom: 2pt;
        filter: opacity(0.54375) invert(81%) sepia(18%) saturate(284%) hue-rotate(198deg) brightness(83%) contrast(82%);        // stroke: red;
    }

    .pencil:hover {
        filter: opacity(0.9) invert(81%) sepia(18%) saturate(284%) hue-rotate(198deg) brightness(83%) contrast(82%);        // stroke: red;
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