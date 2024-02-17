<script lang="ts">
	import { ViewStore } from "../../../../entities/stores/view-store";
  import Overview from "./overview.svelte";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let viewContent : ViewStore<any>;

  const { viewType } = viewContent;
  console.log($viewType);
</script>

{#if $viewType === "Configure Schema"}
aa
{:else if $viewType === "Overview"}
  <Overview content={viewContent} />
{:else}
<div class="flex justify-center items-center w-full h-full">
  <p class="text-center"> No View Selected </p>
</div>
{/if}
