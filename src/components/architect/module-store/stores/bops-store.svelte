<script lang="ts">
import type { Writable } from "svelte/store";
import type { ModuleCard } from "../../../../common/types/module-card";
import { businessOperations } from "../../../../stores/configuration-store";
  import List from "../../../list/list.svelte";
  import { getBopFunctionInfo } from "../../helpers/get-bop-function-info";
  import StoreModule from "../module-components/store-module.svelte";
  
  export let search : string = "";
  export let storeLocked = false;
  export let bopModules : Writable<ModuleCard[]>;
  businessOperations

  const modules = $businessOperations.map(bop => getBopFunctionInfo(bop))


</script>

<div class="list">
  <List contents={modules} let:item>
      <StoreModule bind:bopModules bind:storeLocked definition={item} moduleType="bop"/>
  </List>
</div>


<style lang="scss">
  .list {
    height: 100%;
    width: 100%;
  }
</style>