<script lang="ts">
  import { systemStore } from "../../../../stores/system-store";
  import List from "../../../list/list.svelte";
  import { getBopFunctionInfo } from "../../helpers/get-bop-function-info";
  import StoreModule from "../module-components/store-module.svelte";
  
  export let search : string = "";
  export let storeLocked = false;

  const modules = $systemStore.businessOperations.map(bop => getBopFunctionInfo(bop))


</script>

<div class="list">
  <List contents={modules} let:item>
      <StoreModule bind:storeLocked definition={item} moduleType="bop"/>
  </List>
</div>


<style lang="scss">
  .list {
    height: 100%;
    width: 100%;
  }
</style>