<script lang="ts">
  import type { Writable } from "svelte/store";
  import ArrayDefinitionEditor from "./array-definition-editor.svelte";
  import EnumDefinitionEditor from "./enum-definition-editor.svelte";
  import type { DefinitionData } from "./obj-def-converter";
  import type { EditorLevel } from "./obj-def-editor-types-and-helpers";
  import ObjectDefinitionObjectEditor from "./object-definition-object-editor.svelte";

  // Default mode is Creating an Obj Definition
  export let editingLevel : EditorLevel;
  export let workingData : Writable<DefinitionData>;
  
  let dataType = $workingData.type;

  $: {
    dataType = $workingData.type;
  }
</script>

<div>
  {#if dataType === "object" || dataType === "cloudedObject"}
    <ObjectDefinitionObjectEditor
      level={editingLevel}
      bind:definitionData={workingData}
      on:navigate-definition
    />
  {:else if dataType === "enum"}
    <EnumDefinitionEditor
      level={editingLevel}
      bind:definitionData={workingData}
      on:navigate-definition
      on:sync-value
    />
  {:else if dataType === "array"}
    <ArrayDefinitionEditor
      level={editingLevel}
      bind:definitionData={workingData}
      on:navigate-definition
    />
  {/if}
</div>
