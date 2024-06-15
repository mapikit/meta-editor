<script lang="ts">
  import { setContext } from "svelte";
	import { PanelStore } from "../../../../entities/stores/panels-store";
  import Overview from "./overview.svelte";
  import Schemas from "./schemas/schemas.svelte";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let viewContent : PanelStore<any, any>;

  setContext("current_panel", viewContent);
  const { panelType: viewType } = viewContent;
</script>

{#if $viewType === "Configure Schema"}
aa
{:else if $viewType === "Overview"}
  <Overview content={viewContent} />
{:else if $viewType === "Schemas"}
  <Schemas content={viewContent} />
{:else}
<div class="flex justify-center items-center w-full h-full">
  <p class="text-center"> No View Selected </p>
</div>
{/if}
