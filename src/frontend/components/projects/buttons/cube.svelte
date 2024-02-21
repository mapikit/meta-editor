<script lang="ts">
    import { ProjectVersionInfo } from "../../../../common/types/project-config-type";
    import Edit from "../../../icons/new-icons/edit.svelte";
    export let version : ProjectVersionInfo;

    function editVersion () {
        console.log("Should edit version", version.version);
    }
</script>
<div class="background" on:click={editVersion} aria-hidden="true">
<!-- <img aria-hidden="true" class="cube" src="src/frontend/components/projects/cube.svg" alt="package"/> -->
<span class="cube"><Edit/></span>
</div>
<style lang="scss">
    .cube {
        stroke-width: 1.3;
        stroke: rgba(166, 168, 192, 0.54375);
        width: 100%;
        height: 100%;
    }

    .cube:hover { stroke: rgba(60, 246, 145, 1); }


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