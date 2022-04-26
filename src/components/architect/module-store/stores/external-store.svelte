<script async lang="ts">
  import type { FunctionDefinition, MetaFunction, MetaPackage } from "@meta-system/meta-function-helper";
  import List from "../../../list/list.svelte";
  import { functionsInfo } from "../../helpers/functions-info";
  import StoreSection from "../store-section.svelte";
  import axios from "axios";
  import beautify from "json-beautify";
  import { mapikitServer } from "../../../../common/network";
  import { dataset_dev } from "svelte/internal";
  export let search  = "";
  const packageModules : Record<string, FunctionDefinition[]> = {};

  function getSeparateModules (infos : Array<MetaPackage | MetaFunction>) :  Record<string, FunctionDefinition[]> {
    // Ref bellow comment
    packageModules["Not In a Package"] = [];
    for(const info of infos) {
      if(info["functionsDefinitions"] !== undefined) {
        const mPackage = info as MetaPackage;
        packageModules[mPackage.name] = mPackage.functionsDefinitions as FunctionDefinition[];
      } else {
        //NOTE This is a terrible way to do this, conflict, change.
        const mFunction = info as MetaFunction;
        packageModules["Not In a Package"].push(mFunction);
      }
    }
    return packageModules;
  }
</script>

<div class="list">
  {#await mapikitServer.get("getConfigs")}
    <div> Looking for available modules... </div>
  {:then result}
    <List contents={Object.keys(getSeparateModules(result.data.functionsInfo))} let:item>
      <StoreSection 
        summary={item} 
        modulesInSection={packageModules[item]}
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