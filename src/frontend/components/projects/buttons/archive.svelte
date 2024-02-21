<script lang="ts">
    import { ProjectVersionInfo } from "../../../../common/types/project-config-type";
    export let version : ProjectVersionInfo;

    function deleteVersion () {
        console.log("Should delete version", version.version);
    }
</script>

<span class="background" on:click={deleteVersion} aria-hidden="true">
<img aria-hidden="true" class="trash" src="src/frontend/components/projects/trash.svg" alt="trash"/>
</span>

<style lang="scss">
    .trash {
        height: 100%;
        filter: opacity(0.54375) invert(81%) sepia(18%) saturate(284%) hue-rotate(198deg) brightness(83%) contrast(82%);        // stroke: red;
    }

    .trash:hover { filter: invert(55%) sepia(51%) saturate(5164%) hue-rotate(319deg) brightness(106%) contrast(95%); }

    .background {
        display: inline-flex;
        background-color: #151537;
        border-radius: 8pt;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 4pt;
        aspect-ratio: 1 / 1;
    }
</style>