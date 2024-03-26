<script lang="ts">
  import { SubdivisionStore } from "../../../../entities/stores/dock-subdivision-store";
  import { DockMutations } from "../../../../entities/mutations/dock-mutations";
  import PanelOptions from "./panel-options.svelte";

  export let parent : SubdivisionStore;
  export let currentElement : SubdivisionStore;

  let { view } = currentElement;
  let title;

  $: {
    title = $view.title;
  }

  let finalTitle = $title ?? "Not selected";
</script>

<header class="w-full h-9 px-2 py-1 flex flex-row items-center">
  <span class="text-white text-md whitespace-nowrap"> {finalTitle} </span>
  <div class="flex flex-row justify-end flex-1">
    <PanelOptions parent={parent} currentElement={currentElement}/>
  </div>
</header>
