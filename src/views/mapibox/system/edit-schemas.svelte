<script lang="ts">
  import DefinitionApp from "../../../components/system-page/system-editor/definition-app.svelte";
  import GuideText from "../../../components/common/guide-text.svelte";
  import { EditorLevels } from "../../../components/object-definition/obj-def-editor-types-and-helpers";
  import type { Schema } from "../../../entities/schema";
  import { get } from "svelte/store";
  import { getSchemaById, schemas } from "../../../stores/configuration-store";
  import { navigation } from "../../../lib/navigation";
  import { onDestroy } from "svelte";
  import { guideText } from "../../../stores/layout-tabs-store";
  import ConfigurationSection from "../../../components/configuration/configuration-section.svelte";

  let schemaList : Schema[] = $schemas;
  let pathParams = navigation.currentPathParamsSubscribable;
  let currentSchemaId = $pathParams["schemaId"];
  let currentSchema = getSchemaById(currentSchemaId);
  let schemaFormat = $currentSchema?.format;
  let schemaName = $currentSchema?.name;

  $: schemaList = $schemas;

  const unsub = pathParams.subscribe((newValue) => {
    currentSchemaId = newValue["schemaId"];
    currentSchema = getSchemaById(currentSchemaId);
    schemaFormat = $currentSchema?.format;
    schemaName = $currentSchema?.name;
    guideText.set(`Editing schema "${$schemaName}" (${currentSchemaId})`);
  });

  onDestroy(unsub);

</script>

<div class="px-8 w-[calc(100%-86px)]">
  <ConfigurationSection type="Schemas" canDelete={true}/>
</div>
