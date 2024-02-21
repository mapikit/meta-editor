<script lang="ts">
    import { ProjectVersionInfo } from "../../../../common/types/project-config-type";
    export let version : ProjectVersionInfo;

    function duplicateVersion () {
        console.log("Should duplicate version", version.version);
    }
</script>

<span class="background" on:click={duplicateVersion} aria-hidden="true">
<img aria-hidden="true" class="squares" src="src/frontend/components/projects/squares.svg" alt="squares"/>
</span>

<style lang="scss">
    .squares {
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
</style>