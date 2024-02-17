<script lang="ts">
	import { Writable, get, writable } from "svelte/store";
	import { FileSystemController } from "../../../entities/controllers/file-system-controller.js";
	import { Project } from "../../../entities/models/project.js";
	import { SystemConfigurationStore, systemConfigurationsStore } from "../../../entities/stores/system-configurations-store.js";
	import Cube from "./buttons/cube.svelte";
	import Squares from "./buttons/squares.svelte";
	import Archive from "./buttons/archive.svelte";

    export let project : Project;

    let expanded = false;
    let versionsList = project.listVersions();
    let latestVersion = versionsList.sort((versionA, versionB) => versionB.localeCompare(versionA))[0]

    let configs : Writable<SystemConfigurationStore[]> = writable([]);

    systemConfigurationsStore.items.subscribe(items => {
        if(!expanded) return;
        configs.set(items
            .filter(config => get(config.projectId) === project.identifier) // Filters current project versions
            .sort((versionA, versionB) => 
                (get(versionB.updatedAt).getTime() - get(versionA.updatedAt).getTime()) || // Sort By last update
                (get(versionB.version).localeCompare(get(versionA.version))) // Otherwise, sort by version
            ))
        }
    )

    // configs.subscribe(_configs => {
    //     versionsList = project.listVersions();
    //     latestVersion = versionsList.sort((versionA, versionB) => versionB.localeCompare(versionA))[0]
    // })

    function editVersion (version : SystemConfigurationStore) : void {
        console.log("Should go to version, for now just logs:", version);
    }

    function duplicateVersion (version : SystemConfigurationStore) : void {
        FileSystemController.duplicateConfiguration(version.toEntity(), project);
        //TODO update after duplication
    }
    
    function deleteVersion (version : SystemConfigurationStore) : void {
        // TODO Alert before deletion
        FileSystemController.removeConfiguration(project, version.toEntity());
    }

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
        console.log("Toggle name edition")
    }
</script>

<div aria-hidden="true" class="card" on:click={() => expanded = !expanded}>
    <div class="name">{project.projectName}<img class="pencil" aria-hidden="true" on:click={editName} alt="Edit" src="src/frontend/components/projects/pencil.svg" /></div>
    <div class="versionsInfo">{project.versions.length} Versions</div>
    <div class="updateInfo">Edited {getRelevantUpdateInfo()}</div>
    <div class="buttons">
        <span><Cube/></span>
        <span class="left-button"><Squares/></span>
        <span class="right-button"><Archive/></span>
    </div>
</div>


<style lang="scss">
    .buttons {
        display: inline-flex;
        margin-top: 10pt;
        margin-left: 17pt;
        margin-right: 17pt;
        width: 100%;
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
        background-color: #21264a;
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
        margin-left: 17pt;
        height: fit-content;
        font-size: 16pt;
        font-weight: 600;
    }

    .versionsInfo {
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