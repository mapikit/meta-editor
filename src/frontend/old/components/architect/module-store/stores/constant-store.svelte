<script lang="ts">
  import type { BopsConstant }
    from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import { get, Writable } from "svelte/store";
  import StoreConstant from "../module-components/store-constant.svelte";
  import { getContext } from "svelte";
  import type { UIBusinessOperation } from "../../../../entities/business-operation";
  import type { ArchitectContext } from "src/entities/auxiliary-entities/architect-context";
import { environmentVariables } from "../../../../stores/configuration-store";
import StoreEnv from "../module-components/store-env.svelte";
  
  let bopConstants : Writable<BopsConstant[]>;
  
  bopConstants = getContext<UIBusinessOperation>("currentBop").constants;
  const context = getContext<ArchitectContext>("architectContext");

  let { storeModalOpen, storeModalContent }  = context;
  console.log($environmentVariables);
</script>

<div class="constantStore">
  <div class="w-full flex flex-col mt-1 first:mt-0">
    <div class="w-full flex flex-row items-center">
      <span class="mr-2"> Environment </span>
      <div class="flex-1 h-[1px] bg-norbalt-100"/>
    </div>
  </div>
  {#each get($environmentVariables) as envVar}
    <StoreEnv env={envVar} />
  {/each}
  <div class="w-full flex flex-col mt-1 first:mt-0">
    <div class="w-full flex flex-row items-center">
      <span class="mr-2"> BOp Constants </span>
      <div class="flex-1 h-[1px] bg-norbalt-100"/>
      <div class="ml-1.5 rounded bg-norbalt-350 text-xs text-offWhite px-2 py-1 cursor-pointer hover:text-white transition-all"
        on:click={() => { storeModalOpen.set(true); storeModalContent.set("createConstant"); }}
      > Create New </div>
    </div>
  </div>

    {#each $bopConstants as constant}
      <div class="listItem"><StoreConstant constant={constant}/></div>
    {/each}
</div>

<style lang="scss">
  .constantStore {
    position: relative;
    height: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
    width: 100%;
  }
</style>