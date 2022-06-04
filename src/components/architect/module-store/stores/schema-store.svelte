<script lang="ts">
  import type { FunctionDefinition } from "@meta-system/meta-function-helper";
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
  import type { SchemaType } from "meta-system/dist/src/configuration/schemas/schemas-type";
  import clone from "deep-clone"
  import { schemas } from "../../../../stores/configuration-store";
  import { get, Writable } from "svelte/store";
  import type { ModuleCard } from "../../../../common/types/module-card";
import type { StoreModuleInfo } from "../../../../common/types/store-module-info";
import { FunctionsInfo } from "../../helpers/functions-info";
  export let search : string;
  export let storeLocked = false;
  export let bopModules : Writable<ModuleCard[]>

  const schemasFunctions : Record<string, Array<StoreModuleInfo>> = {};
  for(const schema of $schemas) {
    const schemaName = get(schema.name);
    const sectionTitle = `${schemaName} Functions`;
    schemasFunctions[sectionTitle] = [];
    for(const info of FunctionsInfo.getSchemasInfo(schemaName)) {
      schemasFunctions[sectionTitle].push({
        ...info,
        schemaName,
      })
    }
  }

</script>
<div class="list">
  <List contents={Object.keys(schemasFunctions)} let:item>
    <StoreSection
      sectionModulesType="schemaFunction"
      summary={item} 
      modulesInSection={schemasFunctions[item]}
      bind:search
      bind:storeLocked
      bind:bopModules
    />
  </List>
</div>


<style lang="scss">
  .list {
    height: 100%;
  }
</style>