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
  import { systemConfigurationsStore } from "../entities/stores/system-configurations-store";
  import { get } from "svelte/store";
  import { projectsStore } from "../entities/stores/projects-store";
  import { IconToolboxData, ToolboxAction } from "../entities/models/view-related/icon-toolbox";
  import { FloppyDisk } from "phosphor-svelte";
  import { SystemConfigurationController } from "../entities/controllers/system-configuration-controller";

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

  const getEditorName = () : string => {
    let projectName = "";
    let configurationName = "";

    projectName = get(get(projectsStore.currentlyOpenItems).projectName);
    configurationName = get(get(systemConfigurationsStore.currentlyOpenItems).name);

    return `${projectName} / ${configurationName}`;
  };

  const getEditorToolbar = () : IconToolboxData[] => {
    const result = [];
    const fileButton = new IconToolboxData(FloppyDisk, "File");
    const saveAction = new ToolboxAction(
      "Save",
      "Saves currently open version, overwriting it on disk",
      async () => {
        const project = get(projectsStore.currentlyOpenItems).toEntity();
        const configuration = get(systemConfigurationsStore.currentlyOpenItems).toEntity();
        await SystemConfigurationController.save(project, configuration);
      },
    );

    fileButton.actions.push(saveAction);
    return result.concat([fileButton]);
  };
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
      <Route path="/projects/:identifier/versions/:version_identifier"
        onEnter={async () => {
          globalHeaderStore.title.set(getEditorName());
          globalHeaderStore.iconToolboxes.set(getEditorToolbar());
        }}
      >
        <Editor />
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
