<script lang="ts">
    import { ProjectVersionInfo } from "../../../../common/types/project-config-type";
    import Edit from "../../../icons/new-icons/edit.svelte";
    export let version : ProjectVersionInfo;

    function editVersion () : void {
        console.log("Should go to version, for now just logs:", version);
    }
</script>
<div class="inline-flex bg-norbalt-400 rounded-md h-full p-1 aspect-square" on:click={editVersion} aria-hidden="true">
<!-- <img aria-hidden="true" class="cube" src="src/frontend/components/projects/cube.svg" alt="package"/> -->
<span class="stroke-offWhite stroke w-full h-full hover:stroke-brightGreen"><Edit/></span>
</div>
