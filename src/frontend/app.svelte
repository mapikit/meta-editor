<script lang="ts">
	import { onMount } from "svelte";
	import DockingArea from "./views/editor/docking-area.svelte";
	import { CursorMutations } from "../entities/mutations/cursor-mutations";
	import { SystemConfigurationController } from "../entities/controllers/system-configuration-controller";
	import { DockController } from "../entities/controllers/dock-controller";
  import { GenericLayoutStateMutations } from "../entities/mutations/layout-state-mutations";
  import genericLayoutStateStore from "../entities/stores/generic-layout-state-store";
  import Loading from "./views/generic/loading.svelte";
  import Layout from "./layout.svelte";
  import { Route, Switch, navigation } from "./lib/navigation";
  import Hub from "./views/hub/hub.svelte";
  import Projects from "./views/projects.svelte";
  import { EditorMetadataMutations } from "../entities/mutations/editor-metadata-mutations";

  const spawn = () : void => {
    loading.set(true);
    EditorMetadataMutations.loadData()
      .then(() => {
        loading.set(false);
      })
      .catch(() => {
        console.error("failed to boot");
      });
  };

  onMount(() => {
    spawn();
    GenericLayoutStateMutations.reset();
    GenericLayoutStateMutations.setLoading();
    SystemConfigurationController.TESTAddAndLoadConfiguration();
    DockController.bootDefault();
    GenericLayoutStateMutations.setDone();
  });

  const { loading, ready } = genericLayoutStateStore;
</script>

{#if !$ready || $loading}
  <Loading />
{:else}
  <Layout>
    <Switch basePath="/">
      <Route path="/">
        <Hub />
      </Route>
      <Route path="/editor">
        <DockingArea />
      </Route>
      <Route path="/projects">
        <Projects />
      </Route>
    </Switch>
  </Layout>
{/if}

<svelte:body on:mousemove={CursorMutations.positionEventHandler}/>
<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true">
  <link href="https://fonts.googleapis.com/css2?family=Dosis:wght@200;300;400;500;600;700;800&display=swap"
    rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Comfortaa" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Livvic" rel="stylesheet">
  <title> Meta-Editor </title>
</svelte:head>
