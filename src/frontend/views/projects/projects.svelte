<script lang="ts">
  import MetaSystemIcon from "../../icons/meta-system-icon.svelte";
  import TextButton from "../../components/buttons/text-button.svelte";
  import { navigation } from "../../lib/navigation";
  import { ProjectsController } from "../../../entities/controllers/projects-controller";
  import { projectsStore } from "../../../entities/stores/projects-store";
  import ProjectCard from "./project-card.svelte";
  import { writable } from "svelte/store";
  import { setContext } from "svelte";

  const projects = projectsStore.items;

  const scrollAmount = writable(0);
  let scrollingListElement : HTMLElement;

  const compensateScroll = () : void => {
    scrollAmount.set(scrollingListElement.scrollTop);
  };

  setContext("scroll-compensation", scrollAmount);
</script>

<section class="max-w-7xl w-full px-8 flex flex-col max-h-full"> <!-- Content container-->
  <div class="flex flex-row mt-10 items-center">
    <button class="w-12 h-12 mb-1 stroke-norbalt-200 fill-norbalt-200" on:click={() => {navigation.navigateTo("/");}}>
      <MetaSystemIcon width={2} class="hover:stroke-norbalt-100 hover:fill-norbalt-100"/>
    </button>
    <h1 class="font-[Livvic] ml-4 text-3xl font-semibold" > Your Projects </h1>
    <TextButton text="Create" clickFunction={ProjectsController.createNewProject}/>
    <TextButton text="Import From Folder" lessMargin clickFunction={() => {}}/>
  </div>
  {#await ProjectsController.loadAllProjects()}
  Loading Projects...
  <!--eslint-disable-next-line @typescript-eslint/no-unused-vars-->
  {:then _result}
  <div class="overflow-y-scroll mt-6"
    on:scroll={compensateScroll}
    bind:this={scrollingListElement}
  >
    <div class="flex flex-wrap py-5 pb-24 -ml-6 -mt-11 pointer-events-none">
      {#each $projects as project (project.identifier)}
      <ProjectCard project={project}/>
      {/each}
    </div>
  </div>
  {/await}
</section>

