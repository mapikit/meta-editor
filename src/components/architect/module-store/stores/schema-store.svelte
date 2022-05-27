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
  import type { Writable } from "svelte/store";
  import type { ModuleCard } from "../../../../common/types/module-card";
  export let search : string;
  export let storeLocked = false;
  export let bopModules : Writable<ModuleCard[]>

  const schemaFunctionsInfo : FunctionDefinition[] = [
    countInfo, deleteByIdInfo, deleteInfo, getByIdInfo, getInfo, createInfo, updateByIdInfo, updateInfo,
  ];

  const schemasFunctions : Record<string, Array<FunctionDefinition>> = {};
  for(const schema of $schemas) {
    schemasFunctions[`${schema.name} Functions`] = treatInfo(schemaFunctionsInfo, schema as unknown as SchemaType);
  }

  function treatInfo(functionsInfo : FunctionDefinition[], schema : SchemaType) : FunctionDefinition[] {
    const treatedInfo = clone(functionsInfo);
    treatedInfo.map(info => {
      for(const input of Object.keys(info.input)) {
        if(info.input[input].type === "%entity") {
          info.input[input]["subtype"] = schema.format;
          info.input[input].type = "object"
        }
      }
      for(const output of Object.keys(info.output)) {
        if(info.output[output].type === "%entity") {
          info.output[output]["subtype"] = schema.format;
          info.output[output].type = "object"
        }
      }
    })
    return treatedInfo;
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