<script lang="ts">
  import PropertyList from "../../../components/system-page/property-list.svelte";
  import CogSidebarDecoration from "../../../components/cog-sidebar-decoration.svelte";
  import MinifiedSystemsSidebar from "../../../components/systems-sidebar/minified-systems-sidebar.svelte";
  import { fly } from "svelte/transition";
  import Route from "../../../lib/router/route.svelte";
  import EditProtocols from "./edit-protocols.svelte";
  import EditionCanvas from "../../../components/architect/edition-canvas.svelte";
  import EditSchemas from "./edit-schemas.svelte";
  import { Schema } from "../../../entities/schema";
  import { schemas } from "../../../stores/configuration-store";
  import type { PropertyListEntry } from "../../../common/types/property-list-entry";
  import SystemBasePropertyEditor from "../../../components/system-page/system-base-property-editor.svelte";

  let schemasPropertyList : PropertyListEntry[];

  $: schemasPropertyList = $schemas.map((value) => value.getSchemaCardInfo());

</script>

  <title> System | mapikit </title>
  <div class="content" in:fly={{ x: 150, duration: 250, delay: 250 }} out:fly={{ x: -150, duration: 250 }} >
    <MinifiedSystemsSidebar/>
    <CogSidebarDecoration/>
    <Route path="/mapibox/system/:systemId/protocols/:protocolId/edit">
      <EditProtocols />
    </Route>
    <Route path="/mapibox/system/:systemId/schemas/:schemaId/edit">
      <EditSchemas/>
    </Route>
    <Route path="/mapibox/system/:systemId/bops/:bopId/edit">
      <EditionCanvas />
    </Route>
    <Route path="/mapibox/system/:systemId/:selectedProp/">
      <div class="list">
        <div class="scroller">
          <div class="top-gradient-rolloff" />
          <SystemBasePropertyEditor />
          <PropertyList listType="schemas" listData={schemasPropertyList} createNewEntryHandler={Schema.createNewSchema}/>
          <PropertyList listType="bops"/>
          <PropertyList listType="protocols"/>
        </div>
      </div>
    </Route>
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
      overflow-x: hidden;
      flex: 1;
    }

    .top-gradient-rolloff {
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
