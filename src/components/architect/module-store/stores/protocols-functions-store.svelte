<script async lang="ts">
  import type { FunctionDefinition, MetaFunction, MetaPackage } from "@meta-system/meta-function-helper";
  import List from "../../../list/list.svelte";
  import StoreSection from "../store-section.svelte";
  import beautify from "json-beautify";

  export let search : string = "";
  export let modules : Promise<Record<string, FunctionDefinition[]>>;
  export let storeLocked = false;
</script>

<div class="list">
  {#await modules} 
    <!-- THis is very ineficient and should be changed to a store at protocol addition -->
    <div> Looking for available modules... </div>
  {:then result}
    <List contents={Object.keys(result)} let:item>
      <StoreSection
        sectionModulesType="protocol"
        summary={item} 
        modulesInSection={result[item]}
        bind:search
        bind:storeLocked
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