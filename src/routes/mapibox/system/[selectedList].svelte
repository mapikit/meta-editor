<script lang="ts">
import CogSidebarDecoration from "../../../components/cog-sidebar-decoration.svelte";
import MinifiedSystemsSidebar from "../../../components/systems-sidebar/minified-systems-sidebar.svelte";

  
</script>

<title> System | mapikit </title>
<div class="content">
  <MinifiedSystemsSidebar/>
  <CogSidebarDecoration/>
</div>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: row;
  }
</style>
