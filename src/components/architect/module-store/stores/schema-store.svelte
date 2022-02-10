<script lang="ts">
  import type { FunctionDefinition } from "@meta-system/meta-function-helper";
  import { systemStore } from "../../../../stores/system-store";
  import List from "../../../list/list.svelte";
  import StoreSection from "../store-section.svelte";
  import { countInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/count"
  import { deleteByIdInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/delete-by-id"
  import { deleteInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/delete"
  import { getByIdInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/find-by-id"
  import { getInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/find"
  import { createInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/insert"
  import { updateByIdInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/update-by-id"
  import { updateInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/update"

  export let search : string;

  const schemaFunctionsInfo : FunctionDefinition[] = [
    countInfo, deleteByIdInfo, deleteInfo, getByIdInfo, getInfo, createInfo, updateByIdInfo, updateInfo
  ]


  let schemas = $systemStore.schemas

  const schemasFunctions : Record<string, Array<FunctionDefinition>> = {};
  for(const schema of schemas) {
    schemasFunctions[`${schema.name} Functions`] = schemaFunctionsInfo;
  }

</script>
<div class="list">
  <List contents={Object.keys(schemasFunctions)} let:item>
    <StoreSection 
      summary={item} 
      modulesInSection={schemasFunctions[item]}
      bind:search
    />
  </List>
</div>


<style lang="scss">
  .list {
    height: 100%;
  }
</style>