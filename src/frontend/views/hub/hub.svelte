<script lang="ts">
  import { get } from "svelte/store";
  import { projectsStore } from "../../../entities/stores/projects-store";
  import ProjectPreviewCard from "./project-preview-card.svelte";
  import MetaSystemIcon from "../../icons/meta-system-icon.svelte";
  import { navigation } from "../../lib/navigation";
  import { getTailwindColor } from "../../../common/tailwind-configuration-accessor";
  import TextButton from "../../components/text-button.svelte";
  import { ProjectsController } from "../../../entities/controllers/projects-controller";

  function navigateToProjects () : void {
    navigation.navigateTo("/projects");
  }
</script>

<div class="pt-24 w-full h-full overflow-y-scroll flex-col bg-global-bg-gradient flex items-center">
<div class="flex flex-col flex-wrap w-full max-w-6xl px-8 pb-14 self-center">
<span class="justify-center stroke-2 h-72 pb-10"><MetaSystemIcon color={getTailwindColor("norbalt", 300)}
  width={1.3}/></span>
<div>
  <div class="flex w-full justify-start items-center">
    <div class="text-3xl font-semibold text-white font-[Livvic]">Recent Projects</div>
    <TextButton text={"Open Project List"} clickFunction={navigateToProjects}/>
  </div>
  <div class="flex flex-nowrap w-full py-5 space-x-4">
    {#await ProjectsController.loadAllProjects()}
    Loading Recent Projects...
    {:then}
      {#each get(projectsStore.items) as project}
        <ProjectPreviewCard projectStore={project}/>
      {/each}
    {/await}
  </div>
</div>
<div>
  <div class="text-3xl mt-5 font-semibold text-white font-[Livvic]">Browse Plugins</div>
  <div class="text-offWhite">
    Coming Soon...
  </div>
</div>
</div>
</div>
