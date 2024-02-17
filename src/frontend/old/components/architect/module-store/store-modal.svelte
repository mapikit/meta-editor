<script lang="ts">
  import type { ArchitectContext } from "src/entities/auxiliary-entities/architect-context";
  import { getContext } from "svelte";
  import CreateConstantModal from "./modals/create-constant-modal.svelte";
  import CreateVariableModal from "./modals/create-variable-modal.svelte";

  const context = getContext<ArchitectContext>("architectContext");
  const { storeModalContent, storeModalData } = context;
</script>

<div class="h-full w-full px-2 py-1 pt-3">
  {#if $storeModalContent === "createConstant"}
    <CreateConstantModal />
  {:else if $storeModalContent === "createVariable"}
    <CreateVariableModal />
  {:else if $storeModalContent === "editConstant"}
    <CreateConstantModal initialName={$storeModalData["name"]} initialType={$storeModalData["type"]} initialValue={$storeModalData["value"]} />
  {:else if $storeModalContent === "editVariable"}
    <CreateVariableModal initialName={$storeModalData["name"]} initialType={$storeModalData["type"]} initialValue={$storeModalData["initialValue"]} />
  {:else }
    this is an Error, contact administrators.
  {/if}
</div>