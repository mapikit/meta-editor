<script lang="ts">
  import { Schema } from "src/entities/models/schema";
  import { StoreEntityModel } from "src/entities/models/store-model";
  import { PanelStore } from "src/entities/stores/panels-store";
  import { SchemaStore } from "src/entities/stores/schema-store";
  import { EditorLevel, EditorLevels } from
    "src/frontend/components/object-definition/obj-def-editor-types-and-helpers";
  import ObjectDefinitionMiniApp from "src/frontend/components/object-definition/object-definition-mini-app.svelte";
  import { Writable, get } from "svelte/store";

  export let content : PanelStore<Schema, SchemaStore>;

  let systemData = content.panelContent;
  let currentData : SchemaStore;

  $: {
    currentData = $systemData.entityPanelData;
  }

  console.log();
</script>

<div>
  {#if currentData}
    <ObjectDefinitionMiniApp editingLevel={new EditorLevel(EditorLevels.createDefinition)}
    initialData={currentData.format}
    format={currentData.format}
    />
  {/if}
</div>
