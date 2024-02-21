<script lang="ts">
    import { ProjectVersionInfo } from "../../../../common/types/project-config-type";
    export let version : ProjectVersionInfo;

    function editVersion () {
        console.log("Should edit version", version.version);
    }
</script>
<div class="background" on:click={editVersion} aria-hidden="true">
<img aria-hidden="true" class="cube" src="src/frontend/components/projects/cube.svg" alt="package"/>
</div>
<style lang="scss">
    .cube {
        height: 100%;
        filter: opacity(0.54375) invert(81%) sepia(18%) saturate(284%) hue-rotate(198deg) brightness(83%) contrast(82%);        // stroke: red;
    }

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

    .cube:hover { filter: invert(77%) sepia(55%) saturate(541%) hue-rotate(84deg) brightness(96%) contrast(100%); }

</style>