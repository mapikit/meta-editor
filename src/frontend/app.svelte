<script lang="ts">
	import { onMount } from "svelte";
	import { CursorMutations } from "../entities/mutations/cursor-mutations";
	import { DockController } from "../entities/controllers/dock-controller";
  import { GenericLayoutStateMutations } from "../entities/mutations/layout-state-mutations";
  import genericLayoutStateStore from "../entities/stores/generic-layout-state-store";
  import Loading from "./views/generic/loading.svelte";
  import Layout from "./layout.svelte";
  import { Route, Switch } from "./lib/navigation";
  import Hub from "./views/hub/hub.svelte";
  import Projects from "./views/projects/projects.svelte";
  import Editor from "./views/editor/editor.svelte";
  import { EditorMetadataController } from "../entities/controllers/editor-metadata-controller";
  import GlobalHeader from "./views/header/global-header.svelte";
  import { globalHeaderStore } from "../entities/stores/global-header-store";
  import cursorStore from "../entities/stores/cursor-store";
  import Tooltip from "./components/tooltip.svelte";

  const spawn = () : void => {
    loading.set(true);
    EditorMetadataController.loadMetadata()
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
    DockController.bootDefault();
    GenericLayoutStateMutations.setDone();
  });

  const { loading, ready } = genericLayoutStateStore;
  const { position } = cursorStore;
  let x = 0, y = 0;

  $: x = $position.x;
  $: y = $position.y;

  let vis = false;
</script>

{#if !$ready || $loading}
  <Loading />
{:else}
  <Layout>
    <GlobalHeader slot="header"/>
    <Switch basePath="/" slot="content">
      <Route path="/" onEnter={() => { globalHeaderStore.title.set("Meta-Editor"); }}>
        <Hub />
      </Route>
      <Route path="/projects" onEnter={() => { globalHeaderStore.title.set("Projects"); }}>
        <Projects />
      </Route>
      <Route path="/projects/:identifier/versions/:version_identifier">
        <Editor />
      </Route>
    </Switch>
  </Layout>
{/if}

<button class="absolute bg-roseRed-light w-10 h-10"
  style={`top: 0; left: 0; transform: translate(calc(${x}px - 50%), calc(${y}px - 50%));`}
  on:click={() => { vis = !vis; }}
>
  <Tooltip tooltipContent={"Teste notfication"} visible={vis} position="left"/>
</button>

<svelte:body on:mousemove={CursorMutations.positionEventHandler} class="overflow-hidden"/>
<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true">
  <link href="https://fonts.googleapis.com/css2?family=Dosis:wght@200;300;400;500;600;700;800&display=swap"
    rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Comfortaa" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Livvic" rel="stylesheet">
  <title> Meta-Editor </title>
</svelte:head>
<svelte:document class="overflow-hidden"/>
