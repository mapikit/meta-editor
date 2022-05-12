<script lang="ts">
  import globalUser from "../../stores/global-user-store";
  import { guideText } from "../../stores/layout-tabs-store";
  import SidebarSystem from "./sidebar-system.svelte";
  
  const systems = globalUser.projects;

  guideText.set("Select or create a system to work with.");
</script>

<div class="sidebar">
 {#each $systems as system}
  <SidebarSystem system="{system}" />
 {/each}
</div>

<style lang="scss">

.sidebar {
  width: 460px;
  height: calc(100vh - 48px);
  background-color: #1a1a2a;
  padding: 18px 38px;
  overflow-y: auto;
}

</style>
