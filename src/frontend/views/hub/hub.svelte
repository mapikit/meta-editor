<script lang="ts">
  import { get } from "svelte/store";
  import { FileSystemController } from "../../../entities/controllers/file-system-controller";
  import projectsStore from "../../../entities/stores/projects-store";
  import ProjectPreviewCard from "./project-preview-card.svelte";
  import MetaSystemIcon from "../../icons/meta-system-icon.svelte";
  import { navigation } from "../../lib/navigation";
    import { getTailwindColor } from "../../../common/tailwind-configuration-accessor";

  function navigateToProjects () : void {
    navigation.navigateTo("/projects");
  }
</script>

<div class="pt-24 w-full h-full overflow-y-scroll flex-col bg-global-bg-gradient flex items-center">
<div class="flex flex-col flex-wrap w-full max-w-6xl px-8 pb-14 self-center">
<span class="justify-center stroke-2 h-60 pb-10"><MetaSystemIcon color={getTailwindColor("norbalt", 300)}
  width={1.3}/></span>
<div>
  <div class="inline-flex w-full">
      <div class="text-3xl font-semibold text-white">Recent Projects</div>
      <span aria-hidden="true"
      class="bg-norbalt-400 rounded font-bold p-2 text-base text-w text-offWhite mr-0 ml-auto
      hover:bg-norbalt-300 select-none cursor-pointer" on:click={navigateToProjects}>Open All Projects > </span>
  </div>
  <div class="flex flex-nowrap w-full py-4 space-x-4">
      {#await FileSystemController.projectsController.loadAll()}
      Loading Recent Projects...
      {:then}
          {#each get(projectsStore.items) as project}
              <ProjectPreviewCard project={project}/>
          {/each}
      {/await}
  </div>
</div>
<div>
  <div class="text-3xl font-semibold text-white">Browse Plugins</div>
  <div class="text-offWhite">
      Coming Soon...
  </div>
</div>
</div>
</div>
