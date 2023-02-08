<script lang="ts">
  import type { BopsVariable }
    from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import type { Writable } from "svelte/store";
  import { getContext } from "svelte";
  import type { UIBusinessOperation } from "../../../../entities/business-operation";
  import type { ArchitectContext } from "src/entities/auxiliary-entities/architect-context";
  import StoreVariable from "../module-components/store-variable.svelte";
  
  let bopVariables : Writable<BopsVariable[]>;
  
  bopVariables = getContext<UIBusinessOperation>("currentBop").variables;
  const context = getContext<ArchitectContext>("architectContext");

  let { storeModalOpen, storeModalContent }  = context;

</script>

<div class="varStore">
  <div class="w-full flex flex-col mt-1 first:mt-0">
    <div class="w-full flex flex-row items-center">
      <span class="mr-2"> Values </span>
      <div class="flex-1 h-[1px] bg-norbalt-100"/>
      <div class="ml-1.5 rounded bg-norbalt-350 text-xs text-offWhite px-2 py-1 cursor-pointer hover:text-white transition-all"
        on:click={() => { storeModalOpen.set(true); storeModalContent.set("createVariable"); }}
      > Create New </div>
    </div>
  </div>

  {#each $bopVariables as varEl}
    <div class="listItem"><StoreVariable variable={varEl}/></div>
  {/each}
</div>

<style lang="scss">
  .varStore {
    position: relative;
    height: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
    width: 100%;
  }
</style>