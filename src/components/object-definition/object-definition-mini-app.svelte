<script lang="ts">
  import type { ObjectDefinition } from "@meta-system/object-definition";
  import { convertDefinitionDataToObjectDefinition, convertObjDefinitionToDefinitionData, DefinitionData } from "./obj-def-converter";
  import { EditorLevel, EditorLevels } from "./obj-def-editor-types-and-helpers";
  import ObjectDefinitionEditor from "./object-definition-editor.svelte";

  // Default mode is Creating an Obj Definition
  export let editingLevel : EditorLevel = new EditorLevel(EditorLevels.createAndSignDefinition);
  export let initialDefinition : ObjectDefinition = {
    "aProp": { "type": "object", "required": true, subtype: { "inner": { "type": "string" } } }
  };

  export let initialData : object = {
    aProp: { inner: "hiya" }
  };

  let definitionData : DefinitionData[] = convertObjDefinitionToDefinitionData(initialDefinition, initialData);
  const rootDefinitionData : DefinitionData = {
    subtype: definitionData,
    keyName: "root",
    type: "object",
    value: initialData,
    required: true
  }

  let selectedData : DefinitionData = rootDefinitionData;

  // May contain deep paths like "prop.innerProp"
  let workingDefinitionPath : Array<string> = [];
  let levelOverrideMap = new Map<number, EditorLevels>();
  let currentLevel = editingLevel;

  const setWorkingDataAndLevel = () => {
    const dicedDefinitionPath = [];
    workingDefinitionPath.forEach((path : string) => {
      const parts = path.split(".");
      dicedDefinitionPath.push(...parts);
    })

    let intermediarySelectedData = rootDefinitionData;
    for (let path of dicedDefinitionPath) {
      intermediarySelectedData = intermediarySelectedData[path];
    }

    let lastValidLevel = editingLevel.level;
    for (let i = 1; i <= workingDefinitionPath.length; i ++) {
      lastValidLevel = levelOverrideMap.get(i) ?? lastValidLevel;
    }

    currentLevel = new EditorLevel(lastValidLevel);
    selectedData = intermediarySelectedData;
  }


  const navigateTo = (path : string, levelOverride ?: EditorLevels) => {
    workingDefinitionPath.push(path);
    workingDefinitionPath = workingDefinitionPath;

    if (levelOverride !== undefined) {
      levelOverrideMap.set(workingDefinitionPath.length, levelOverride);
    }

    console.log(path, levelOverride)
    setWorkingDataAndLevel();
  }

  const goBackOneLevel = () => {
    levelOverrideMap.delete(workingDefinitionPath.length);

    workingDefinitionPath.pop();
    workingDefinitionPath = workingDefinitionPath;

    setWorkingDataAndLevel();
  }
</script>

<div class="editor">
  <div class="back" on:click="{goBackOneLevel}"> GO BACK </div>
  <div class="back" on:click="{() => { console.log(convertDefinitionDataToObjectDefinition(rootDefinitionData)) }}"> log objDef </div>
  <div class="back" on:click="{() => { workingDefinitionPath = []; levelOverrideMap.clear(); setWorkingDataAndLevel() }}"> Reset Navigation </div>
  <ObjectDefinitionEditor
    editingLevel={currentLevel}
    bind:workingData={selectedData}
    on:navigate-definition={(event) => { navigateTo(event.detail.path, event.detail.levelOverride) }}
  />
</div>


<style lang="scss">
  .editor {
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
    background-color: #313161;
  }
</style>