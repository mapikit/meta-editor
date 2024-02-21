<script lang="ts">
    import { ProjectVersionInfo } from "../../../common/types/project-config-type";
    import PassiveEditableTextField from "../common/passive-editable-text-field.svelte";
    import Archive from "./buttons/archive.svelte";
    import Cube from "./buttons/cube.svelte";
    import Squares from "./buttons/squares.svelte";

    export let versionsInfos : ProjectVersionInfo[] = []
    let expanded = false;

</script>

<span aria-hidden="true" class="chevron" on:click={()=>expanded=!expanded}>
v
</span>
{#if expanded}
<div class="dropdown">
    {#each versionsInfos as version}
        <div class="version"> <PassiveEditableTextField bind:text={version.version} onFinishEdit={() => console.log("Done editing")}/><span class="buttons">
            <span><Cube version={version}/></span>
            <span><Squares version={version}/></span>
            <span><Archive version={version}/></span>
        </span></div><br>
    {/each}
</div>
{/if}

<!-- <span class="buttons"><Cube/><Squares/><Archive/></span> -->

<style lang="scss">
    .dropdown {
        position: absolute;
        display: flexbox;
        padding: 6pt;
        border-radius: 4pt;
        left: 0;
        top: 18pt;
        border: 2px solid rgba(50, 56, 98, 1);
        background-color: rgba(33, 38, 74, 1);
        box-shadow: 0px 4px 19px -8px rgba(3, 3, 12, 0.31);    
        z-index: 10;
        width: 200pt;
    }

    .version {
        align-items: center;
        padding: 2pt;
        display: flex;
        display: inline-flex;
        width: 100%;
    }

    .chevron {
        cursor: pointer;
        user-select: none;
    }

    .buttons {
        display: inline-flex;
        height: 22pt;
        margin-right: 0;
    }

    .buttons > * {
        margin-left: 2pt;
    }
</style>