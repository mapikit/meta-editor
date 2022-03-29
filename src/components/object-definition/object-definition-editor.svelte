<script lang="ts">
  import type { ObjectDefinition } from "@meta-system/object-definition";
import EnumDefinitionEditor from "./enum-definition-editor.svelte";
  import { convertObjDefinitionToDefinitionData, DefinitionData } from "./obj-def-converter";
  import { EditorLevel, EditorLevels } from "./obj-def-editor-types-and-helpers";
import ObjectDefinitionObjectEditor from "./object-definition-object-editor.svelte";

  // Default mode is Creating an Obj Definition
  export let editingLevel : EditorLevel = new EditorLevel(EditorLevels.createAndSignDefinition);
  export let initialDefinition : ObjectDefinition = {
    "anEnum": { "type": "enum", "required": true, subtype: [
      "prop1", "another prop", "YEE HAW"
    ]}
  };

  export let initialData : object = {
    anEnum: "prop1"
  };

  let definitionData : DefinitionData[] = convertObjDefinitionToDefinitionData(initialDefinition, initialData);
  
  let currentWorkingData : any = definitionData;
  let dataType = "object";
  // let upperLevelDataType = "object";
  let workingDefinitionPath : number[] = [];
  let upperLevelWorkingData = null;

  const setWorkingData = (definitionKey : DefinitionData, index : number) => {
    let keySubtype = definitionKey.subtype as ObjectDefinition;
    workingDefinitionPath.push(index);

    workingDefinitionPath = workingDefinitionPath;

    setDataType();
    upperLevelWorkingData = currentWorkingData;

    if (dataType === "array") {
      // I am too lazy to think of a correct
      // type def just for this use-case.
      currentWorkingData = definitionKey.value;
      return;
    }
    currentWorkingData = keySubtype;

    bindUpdates();
  }

  const setDataType = () => {
    let preselectedDataType : any = "object";

    workingDefinitionPath.forEach((dataIndex, index) => {
      if (index === workingDefinitionPath.length - 1) {
        preselectedDataType = definitionData[dataIndex].type;
        return;
      }

      preselectedDataType = definitionData[dataIndex].subtype;
    })

    dataType = preselectedDataType;
  }

  const goBackOneLevel = () => {
    if (workingDefinitionPath.length <= 0) { return; }
    workingDefinitionPath.pop();

    setDataType()
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

  // selects the first option of an enum whenever the options are changed.
  const correctEnumDataChange = () => {
    let workingDefinitionData;

    for (let index of workingDefinitionPath) {
      workingDefinitionData = definitionData[index];
    }

    workingDefinitionData.value = workingDefinitionData.subtype[0] ?? "";
  }
</script>

<div class="top-level-editor">
  <div class="back" on:click="{goBackOneLevel}"> GO BACK </div>
  <div class="back" on:click="{() => console.log(definitionData)}"> log toplevel data </div>
  <div class="back" on:click="{() => console.log(currentWorkingData)}"> log working data </div>
  {#if dataType === "object"}
    <ObjectDefinitionObjectEditor
      level={editingLevel}
      bind:definitionData={currentWorkingData}
      on:navigate-definition={(event) => { setWorkingData(event.detail.definition, event.detail.index) }}
    />
  {:else if dataType === "enum"}
    <EnumDefinitionEditor
      level={editingLevel}
      bind:definitionData={currentWorkingData}
      on:navigate-definition={(event) => { setWorkingData(event.detail.definition, event.detail.index) }}
      on:sync-value={() => {correctEnumDataChange()}}
    />
  {:else if dataType === "array"}
    <div> Dunno to edit arrays :( </div>
  {/if}
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
