<script lang="ts">
  import {
    formatDistance } from "date-fns";
  import { ProjectStore } from "src/entities/stores/projects-store.js";
  import { ArrowRight } from "phosphor-svelte";
  import { navigation } from "../../../frontend/lib/navigation/index.js";
  import { ProjectsController } from "../../../entities/controllers/projects-controller.js";
  import { SystemConfigurationController } from "../../../entities/controllers/system-configuration-controller.js";

  export let projectStore : ProjectStore;
  let { updatedAt, projectName, versions } = projectStore;

  let project = projectStore.toEntity();
  let hovered = false;
  let mouseoutDelayTimeout;
  let timeoutMs = 200;

  let quickEditButtonText = project.getLatestVersionIdentifier() === undefined ? "Create New Version" : "Edit Latest";
  function getRelevantUpdateInfo () : string {
    const now = new Date();
    return formatDistance($updatedAt, now, { addSuffix: true });
  }

  const goToLatestVersion = async () : Promise<void> => {
    await ProjectsController.selectProject(project);
    let latestVersionId = project.getLatestVersionIdentifier();
    if (latestVersionId === undefined) {
      latestVersionId = (await SystemConfigurationController.createNewEmptyConfiguration()).identifier;
    }


    SystemConfigurationController.loadConfigurationIntoView(latestVersionId);
    navigation.navigateTo(`/projects/${projectStore.identifier}/versions/${latestVersionId}`);
  };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="relative flex flex-col rounded-lg
  bg-card-gradient w-64 h-fit pb-4 pt-3 hover:brightness-125 transition-all duration-150
  outline-2 outline-transparent outline hover:outline-norbalt-200 hover:delay-0 delay-200"
  on:mouseenter={() => {
    hovered = true;
    if (mouseoutDelayTimeout) clearTimeout(mouseoutDelayTimeout);
  }}
  on:mouseleave={() => {
    mouseoutDelayTimeout = setTimeout(() => {
      hovered = false;
      mouseoutDelayTimeout = undefined;
    }, timeoutMs);
  }}
  >

    <div class="absolute {hovered ? "h-12 -mt-6" : "h-0 mt-0"}
      w-full rounded transition-all -translate-y-[100%] bg-norbalt-300 flex
      justify-center items-center"> <!-- Project Card Toolbelt -->
      <button on:click={goToLatestVersion}
        class="inline-flex items-center rounded right-2 top-2
        bg-norbalt-400 px-2 text-offWhite hover:text-white transition-all
        {hovered ? "opacity-100" : "opacity-5"}"
        >
        {quickEditButtonText}
        <ArrowRight class="ml-2" />
      </button>

    </div>
    <div class="w-full ml-5 h-fit text-xl font-bold">{$projectName}</div>
    <div class="relative inline-flex ml-5 mt-1 text-offWhite h-fit">{$versions.length} Versions </div>
    <div class="mt-6 px-2 h-fit mx-5 w-fit bg-norbalt-400 rounded pl-2 text-offWhite">
      Edited {getRelevantUpdateInfo()}
    </div>
</div>
