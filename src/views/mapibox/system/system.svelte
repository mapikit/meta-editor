<script lang="ts">
  import MinifiedSystemsSidebar from "../../../components/systems-sidebar/minified-systems-sidebar.svelte";
  import { fly } from "svelte/transition";
  import Route from "../../../lib/router/route.svelte";
  import EditProtocols from "./edit-protocols.svelte";
  import EditSchemas from "./edit-schemas.svelte";
  import { navigation } from "../../../lib/navigation";
  import { selectedSystem } from "../../../components/systems-sidebar/systems-stores";
  import { onMount } from "svelte";
  import ConfigurationEdit from "./configuration-edit.svelte";
  import ArchitectDataLoader from "../../../components/architect/architect-data-loader.svelte";
  import { currentConfigId } from "../../../stores/configuration-store";

  onMount(() => {
    selectedSystem.set(navigation.currentPathParams["systemId"]);
  });

  function reload () {
    const params = navigation.currentPathParams;
    selectedSystem.set(params["systemId"]);
    currentConfigId.set(params["configurationId"]);
  }
</script>

<title> System | mapikit </title>
<div class="flex flex-row h-full" in:fly={{ x: 150, duration: 250, delay: 250 }} out:fly={{ x: -150, duration: 250 }} >
  <MinifiedSystemsSidebar/>
  <Route path="/mapibox/system/:systemId/configuration/:configurationId/protocols/:protocolId">
    <EditProtocols />
  </Route>
  <Route path="/mapibox/system/:systemId/configuration/:configurationId/schemas/:schemaId" onEnter={reload}>
    <EditSchemas/>
  </Route>
  <Route path="/mapibox/system/:systemId/configuration/:configurationId/bops/:bopId">
    <ArchitectDataLoader />
  </Route>
  <Route path="/mapibox/system/:systemId/configuration/:configurationId" deepMatch={false}>
    <ConfigurationEdit />
  </Route>
</div>
