<script async lang="ts">
  import List from "../../../list/list.svelte";
  import StoreSection from "../store-section.svelte";
  import beautify from "json-beautify";
import type { StoreModuleInfo } from "../../../../common/types/store-module-info";

  export let search = "";
  export let modules : Promise<Record<string, StoreModuleInfo[]>>;
</script>

<div class="list">
  {#await modules} 
    <!-- THis is very ineficient and should be changed to a store at protocol addition -->
    <div> Looking for available modules... </div>
  {:then result}
    {#if Object.keys(result).length === 0}
      <div class="text-center mt-6 text-offWhite"> You have no protocols added in this configuration </div>
    {/if}
    <List contents={Object.keys(result)} let:item>
      <StoreSection
        sectionModulesType="protocol"
        summary={item} 
        modulesInSection={result[item]}
        bind:search
      />
    </List>
  {:catch err}
    <div class="inside">Error {beautify(err, null, 1)}</div>
  {/await}
</div>


<style lang="scss">
  .list {
    height: 100%;
    width: 100%;
  }
  .inside {
    background-color: red;
  }
</style>