<script lang="ts">
  import type { ObjectDefinition } from "@meta-system/object-definition";
  import { convertObjDefinitionToDefinitionData, DefinitionData } from "./obj-def-converter";
  import { EditorLevel, EditorLevels } from "./obj-def-editor-types-and-helpers";
import ObjectDefinitionObjectEditor from "./object-definition-object-editor.svelte";

  // Default mode is Creating an Obj Definition
  export let editingLevel : EditorLevel = new EditorLevel(EditorLevels.createAndSignDefinition);
  export let initialDefinition : ObjectDefinition = {
    "someKey": { "type": "object", "required": true, subtype: {
      "aSubKey": { "type": "date", }
    }},
    "birthDate": { "type": "date" }
  };

  export let initialData : object = {
    someKey: {
      aSubKey: new Date(899999992222),
    }
  };

  let definitionData : DefinitionData[] = convertObjDefinitionToDefinitionData(initialDefinition, initialData);
  
  let currentWorkingData : unknown = definitionData;
  let workingDefinitionPath = [];
  let upperLevelWorkingData = null;

  const setWorkingData = (definitionKey : DefinitionData, index : number) => {
    let keySubtype = definitionKey.subtype as ObjectDefinition;
    workingDefinitionPath.push(index);

    workingDefinitionPath = workingDefinitionPath;

    upperLevelWorkingData = currentWorkingData;
    currentWorkingData = keySubtype;

    bindUpdates();
  }

  const goBackOneLevel = () => {
    if (workingDefinitionPath.length <= 0) { return; }
    workingDefinitionPath.pop();

    workingDefinitionPath = workingDefinitionPath;
    currentWorkingData = upperLevelWorkingData;

    bindUpdates();
  }

  const bindUpdates = () => {
    let selected = definitionData;

    if (workingDefinitionPath.length <= 0) {
      currentWorkingData = definitionData;
      upperLevelWorkingData = null;

      return;
    }

    let pathButTheLastItem = workingDefinitionPath.slice(0, workingDefinitionPath.length -1);
    let lastItem = workingDefinitionPath[workingDefinitionPath.length - 1];

    for (let index of pathButTheLastItem) {
      selected = selected[index].subtype as DefinitionData[];
    }

    selected[lastItem].subtype = currentWorkingData;
  }
</script>

<div class="top-level-editor">
  <div class="back" on:click="{goBackOneLevel}"> GO BACK </div>
  <div class="back" on:click="{() => console.log(definitionData)}"> log toplevel data </div>
  <div class="back" on:click="{() => console.log(currentWorkingData)}"> log working data </div>
  <ObjectDefinitionObjectEditor
    level={editingLevel}
    bind:definitionData={currentWorkingData}
    on:navigate-definition={(event) => { setWorkingData(event.detail.definition, event.detail.index) }}
  />
</div>

<style lang="scss">
  .top-level-editor {
    font-family: 'Dosis';
    font-size: 16px;
    display: flex;
    flex-flow: column nowrap;
  }

  .back {
    margin: 8px 32px 18px 32px;
    width: auto;
    text-align: center;
    cursor: pointer;
    border-radius: 6px;
    padding: 4px 6px;
    background-color: #13131f;
  }

</style>
