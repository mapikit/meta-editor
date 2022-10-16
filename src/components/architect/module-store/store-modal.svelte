<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import CreateConstantModal from "./modals/create-constant-modal.svelte";

  const storeModalContent = getContext<Writable<string>>("storeModalContent");
</script>

<div class="h-full w-full px-2 py-1 pt-3">
  {#if $storeModalContent === "createConstant"}
    <CreateConstantModal />
  {:else}
    this is an Error, contact administrators.
  {/if}
</div>