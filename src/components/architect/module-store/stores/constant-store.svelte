<script>

import { bopStore } from "../../../../stores/bop-store";
import StoreConstant from "../module-components/store-constant.svelte";

</script>


<div class="list">
  {#each $bopStore.constants as constant}
    <StoreConstant constant={constant}/>
  {/each}
</div>

<style lang="scss">
  .list {
    justify-content: center;
  }
</style>