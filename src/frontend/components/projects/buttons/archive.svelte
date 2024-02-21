<script lang="ts">
    import { ProjectVersionInfo } from "../../../../common/types/project-config-type";
    import Trash from "../../../icons/new-icons/trash.svelte";
    export let version : ProjectVersionInfo;

    function deleteVersion () {
        console.log("Should delete version", version.version);
    }
</script>

<span class="background" on:click={deleteVersion} aria-hidden="true">
<!-- <img aria-hidden="true" class="trash" src="src/frontend/components/projects/trash.svg" alt="trash"/> -->
<span class="trash"><Trash/></span>
</span>

<style lang="scss">
    .trash {
        stroke-width: 1.5;
        stroke: rgba(166, 168, 192, 0.54375);;
        width: 100%;
        height: 100%;
        transform: translateY(1pt);
    }

    .trash:hover { stroke: rgba(249, 88, 121, 1); }

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