<script lang="ts">
  import MinifiedSystemsSidebar from "../../../components/systems-sidebar/minified-systems-sidebar.svelte";
  import { fly } from "svelte/transition";
  import Route from "../../../lib/router/route.svelte";
  import EditProtocols from "./edit-protocols.svelte";
  import EditionCanvas from "../../../components/architect/edition-canvas.svelte";
  import EditSchemas from "./edit-schemas.svelte";
  import { navigation } from "../../../lib/navigation";
  import { selectedSystem } from "../../../components/systems-sidebar/systems-stores";
  import { onMount } from "svelte";
  import ConfigurationEdit from "./configuration-edit.svelte";

  onMount(() => {
    selectedSystem.set(navigation.currentPathParams["systemId"]);
  });

</script>

<title> System | mapikit </title>
<div class="flex flex-row h-full" in:fly={{ x: 150, duration: 250, delay: 250 }} out:fly={{ x: -150, duration: 250 }} >
  <MinifiedSystemsSidebar/>
  <Route path="/mapibox/system/:systemId/configuration/:configurationId/protocols/:protocolId/edit">
    <EditProtocols />
  </Route>
  <Route path="/mapibox/system/:systemId/configuration/:configurationId/schemas/:schemaId/edit">
    <EditSchemas/>
  </Route>
  <Route path="/mapibox/system/:systemId/configuration/:configurationId/bops/:bopId/edit">
    <EditionCanvas />
  </Route>
  <Route path="/mapibox/system/:systemId/configuration/:configurationId" deepMatch={false}>
    <ConfigurationEdit />
  </Route>
</div>
