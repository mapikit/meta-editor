<script lang="ts">
  import { availableProjects } from "../../stores/projects-store";
  import { Project } from "../../entities/project";
  import { guideText } from "../../stores/layout-tabs-store";
  import SidebarSystem from "./sidebar-system.svelte";

  guideText.set("Select or create a system to work with.");
</script>

<div class="h-full w-80 ml-16">
  <div class="w-full font-sans flex flex-row mt-9 justify-between items-center">
    <p class="text-2xl font-semibold"> Projects </p>
    <div class="bg-norbalt-200 px-4 py-1 rounded font-medium text-offWhite transition-all hover:text-white shadow-light cursor-pointer"
      on:click={Project.addNewProject}
    > Create New </div> 
  </div>
  {#if $availableProjects.length === 0 }
    <p class="text-center text-norbalt-100 text-base font-sans"> You're not in a Project yet. </p>
  {/if}
  {#each $availableProjects as system}
    <SidebarSystem system="{system}" />
  {/each}
</div>

<style lang="scss">
  .add-new-system {
    text-align: center;
    border-radius: 8px;
    padding: 12px;
    background-color: #13131f;
    border-radius: 16px;
    font-family: 'Dosis', sans-serif;
    font-size: 22px;
    z-index: 0;
    max-height: 150px;
    transition: 250ms;
    cursor: pointer;
    margin-top: 16px;

    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    span {
      justify-self: center;
      align-self: center;
    }
  }

  .no-system {
    font-family: "dosis";
    font-size: 22px;
    color: #494963;
    text-align: center;
  }

.sidebar {
  width: 460px;
  height: calc(100vh - 48px);
  background-color: #1a1a2a;
  padding: 18px 38px;
  overflow-y: auto;
}

</style>
