<script lang="ts">
import PropertyList from "../../../components/system-page/property-list.svelte";
import CogSidebarDecoration from "../../../components/cog-sidebar-decoration.svelte";
import MinifiedSystemsSidebar from "../../../components/systems-sidebar/minified-systems-sidebar.svelte";

  
</script>

<title> System | mapikit </title>
<div class="content">
  <MinifiedSystemsSidebar/>
  <CogSidebarDecoration/>
  <div class="list">
    <PropertyList listType="schemas"/>
    <PropertyList listType="bops"/>
    <PropertyList listType="protocols"/>
  </div>
</div>

<style lang="scss">
  .content {
    display: flex;
    flex-flow: row nowrap;
    overflow-y: hidden;
  }

  .list {
    height: auto;
    padding-top: 60px;
    padding-left: 18px;
    overflow-y: scroll;
    flex: 1;
  }
</style>
