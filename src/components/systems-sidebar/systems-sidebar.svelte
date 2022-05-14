<script lang="ts">
  import { availableProjects } from "../../stores/projects-store";
  import { Project } from "../../entities/project";
  import { guideText } from "../../stores/layout-tabs-store";
  import SidebarSystem from "./sidebar-system.svelte";

  guideText.set("Select or create a system to work with.");
</script>

<div class="sidebar">
  {#if $availableProjects.length === 0 }
    <p class="no-system"> You don't have a system yet. </p>
  {/if}
  {#each $availableProjects as system}
    <SidebarSystem system="{system}" />
  {/each}
  <div class="add-new-system" on:click={Project.addNewProject}>
    <span>
      Create New System
    </span>
  </div>
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
