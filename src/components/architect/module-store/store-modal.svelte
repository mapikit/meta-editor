<script lang="ts">
  import type { ArchitectContext } from "src/entities/auxiliary-entities/architect-context";
  import { getContext } from "svelte";
  import CreateConstantModal from "./modals/create-constant-modal.svelte";

  const storeModalContent = getContext<ArchitectContext>("architectContext").storeModalContent;
</script>

<div class="h-full w-full px-2 py-1 pt-3">
  {#if $storeModalContent === "createConstant"}
    <CreateConstantModal />
  {:else}
    this is an Error, contact administrators.
  {/if}
</div>