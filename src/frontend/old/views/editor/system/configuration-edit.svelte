<script lang="ts">
  import CogMulticolorIcon from "../../../icons/cog-multicolor-icon.svelte";
  import { get, readable } from "svelte/store";
  import { currentProject } from "../../../stores/projects-store";
  import Selector from "../../../components/common/selector.svelte";
  import { navigation } from "../../../lib/navigation";
  import { onDestroy } from "svelte";
  import { onMount } from "svelte";
  import { currentConfig, getConfigurationById } from "../../../stores/configuration-store";
  import VersionDisplay from "../../../components/configuration/version-display.svelte";
  import ConfigurationSection from "../../../components/configuration/configuration-section.svelte";
  import EnvVarsEditor from "../../../components/configuration/env-vars-editor.svelte";

  let currentVersion = "";
  let currentVersionId = "";

  const unsub = navigation.currentPathParamsSubscribable.subscribe((params) => {
    currentVersion = get(getConfigurationById(params["configurationId"])
      ?.version ?? readable(""));
  });

  $: selectedProject = $currentProject;
  $: configurations = $currentProject && selectedProject.getConfigurations();
  $: selectedConfiguration = $currentProject && configurations
    .find((config) => get(config.id) === navigation.currentPathParams["configurationId"]);

  onDestroy(unsub);
  onMount(() => {
    const version = getConfigurationById(navigation.currentPathParams["configurationId"]);
    currentVersion = get(version.version);
    currentVersionId = get(version.id);
  });

  const onSelectVersion = (selectedVersion : { value : string, label : string }) : void => {
    const selectedConfig = configurations.find((item) => get(item.version) === selectedVersion.value);

    navigation.navigateTo(`/editor/system/${get(selectedProject.id)}/configuration/${get(selectedConfig.id)}`);
  };
</script>

<div class="h-full w-full pl-7 py-6 overflow-y-auto">
  <div class="flex flex-row items-center"> <!-- title -->
    <CogMulticolorIcon />
    <p class="text-2xl ml-2 font-semibold"> {get(selectedProject.name)} </p>
    <Selector
      styleClass="px-4 pl-8 ml-4"
      onChange={onSelectVersion}
      options={selectedProject.getConfigurations().map((config) => ({ value: get(config.version), label: get(config.version) }))}
      bind:field={currentVersion}
    />
  </div>
  <div class="w-full flex flex-row mt-8"> <!-- version overview and variables -->
    <VersionDisplay currentVersion={$currentConfig}/>
    <EnvVarsEditor configuration={$currentConfig}/>
  </div>
  <ConfigurationSection type="Schemas"/>
  <ConfigurationSection type="Protocols"/>
  <ConfigurationSection type="Business Operations"/>
</div>