<script lang="ts">
    import PassiveEditableTextField from "../text-fields/passive-editable-text-field.svelte";
    import Archive from "./buttons/archive.svelte";
    import Cube from "./buttons/edit.svelte";
    import Squares from "./buttons/duplicate.svelte";
    import { clickOutside } from "../../lib/click-outside-directive";
    import { CaretDown } from "phosphor-svelte";
    import { Project } from "../../../entities/stores/projects-store";

    export let parentProject : Project;
    let versionsStore = parentProject.versions;
    let expanded = false;
</script>

<span aria-hidden="true" class="cursor-pointer inline select-none translate-y-1" on:click={()=>{ expanded=!expanded; }}><CaretDown />
</span>
{#if expanded}
<div class="absolute flexbox p-2 rounded-md left-0 top-full border-norbalt-200 border-2 bg-norbalt-300 z-40 w-max" use:clickOutside on:click_outside={() => { expanded = false; }}>
    {#each $versionsStore as version}
        <div class="items-center p-1 inline-flex w-full"> <PassiveEditableTextField bind:text={version.version} onFinishEdit={() => console.log("Done editing")}/><span class="inline-flex h-7 space-x-0.5 ml-1">
            <span><Cube version={version}/></span>
            <span><Squares version={version} parentProject={parentProject.toEntity()}/></span>
            <span><Archive version={version} parentProject={parentProject.toEntity()}/></span>
        </span></div><br>
    {/each}
</div>
{/if}

