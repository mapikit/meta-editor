<script lang="ts">
  import CogMulticolorIcon from "../../../icons/cog-multicolor-icon.svelte";
  import { get, readable } from "svelte/store";
  import { currentProject } from "../../../stores/projects-store";
  import Selector from "../../../components/common/selector.svelte";
  import { navigation } from "../../../lib/navigation";
  import { onDestroy } from "svelte";
  import { onMount } from "svelte";
  import { getConfigurationById } from "../../../stores/configuration-store";
  import VersionDisplay from "../../../components/configuration/version-display.svelte";
  import ConfigurationSection from "../../../components/configuration/configuration-section.svelte";
  import EnvVarsEditor from "../../../components/configuration/env-vars-editor.svelte";

  let selectedProject = $currentProject;
  let currentVersion = "";

  const unsub = navigation.currentPathParamsSubscribable.subscribe((params) => {
    currentVersion = get(getConfigurationById(params["configurationId"])
      ?.version ?? readable(""));
  });

  $: selectedProject = $currentProject;

  onDestroy(unsub);
  onMount(() => {
    currentVersion = get(getConfigurationById(navigation.currentPathParams["configurationId"])
      .version);
  });

  const onSelectVersion = (selectedVersion) : void => {
    const available = selectedProject.getConfigurations();
    const selectedConfig = available.find((item) => get(item.version) === selectedVersion);

    navigation.navigateTo(`/mapibox/system/${get(selectedProject.id)}/configuration/${get(selectedConfig.id)}`);
  };
</script>

<div class="h-full w-full pl-7 pt-6">
  <div class="flex flex-row items-center"> <!-- title -->
    <CogMulticolorIcon />
    <p class="text-2xl ml-2 font-semibold"> {get(selectedProject.name)} </p>
    <Selector
      styleClass="px-4 pl-8 ml-4"
      onChange={onSelectVersion}
      options={selectedProject.getConfigurations().map((config) => get(config.version))}
      bind:field={currentVersion}
    />
  </div>
  <div class="w-full flex flex-row mt-8"> <!-- version overview and variables -->
    <VersionDisplay currentVersion={selectedProject.getConfiguration()}/>
    <EnvVarsEditor configuration={selectedProject.getConfiguration()}/>
  </div>
  <ConfigurationSection />
</div>