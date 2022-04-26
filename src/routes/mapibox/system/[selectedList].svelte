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
    <div class="scroller">
      <div class="top-grad" />
      <PropertyList listType="schemas"/>
      <PropertyList listType="bops"/>
      <PropertyList listType="protocols"/>
    </div>
  </div>
</div>

<style lang="scss">
  .content {
    display: flex;
    flex-flow: row nowrap;
    overflow-y: hidden;
  }

  .list {
    position: relative;
    height: calc(100vh - 48px);
    padding-top: 60px;
    padding-left: 18px;
    padding-bottom: 28px;
    overflow-y: scroll;
    flex: 1;
  }

  .top-grad {
    // background-color: #13131f;
    width: 100%;
    height: 80px;
    position: fixed;
    z-index: 1;
    top: 48px;
    box-shadow: inset 0px 60px 28px -26px #13131f;
    // box-shadow: 0px 0px 18px -6px #85858a;
  }
</style>
