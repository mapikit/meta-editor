<script lang="ts">
import { getContext } from "svelte";
import { get, Writable } from "svelte/store";
import type { ModuleCard } from "../../../../common/types/module-card";
import type { StoreModuleInfo } from "../../../../common/types/store-module-info";
import type { UIBusinessOperation } from "../../../../entities/business-operation";
import { businessOperations } from "../../../../stores/configuration-store";
import List from "../../../list/list.svelte";
import { getAllBopsInfo } from "../../helpers/get-bop-function-info";
import StoreModule from "../module-components/store-module.svelte";

export let search  = "";
export let storeLocked = false;
export let bopModules : Writable<ModuleCard[]>;

const currentBop = getContext<UIBusinessOperation>("currentBop");

const modules : StoreModuleInfo[] = Array.from(getAllBopsInfo($businessOperations)
  .values()).filter(info => info.bopId !== get(currentBop.id));

</script>

<div class="list">
  <List contents={modules} let:item>
      <StoreModule bind:bopModules module={item} moduleType="bop"/>
  </List>
</div>


<style lang="scss">
  .list {
    height: 100%;
    width: 100%;
  }
</style>