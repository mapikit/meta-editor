<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { ObjectDefinition } from "@meta-system/object-definition";
  import {
    convertDefinitionDataToObjectDefinition,
    convertObjDefinitionToDefinitionData,
    DefinitionData,
  } from "./obj-def-converter";
  import { EditorLevel, EditorLevels } from "./obj-def-editor-types-and-helpers";
  import ObjectDefinitionEditor from "./object-definition-editor.svelte";

  // Default mode is Creating an Obj Definition
  export let editingLevel : EditorLevel = new EditorLevel(EditorLevels.createAndSignDefinition);
  export let initialDefinition : ObjectDefinition;

  const dispatch = createEventDispatcher();

  export let initialData : object;

  let definitionData : DefinitionData[] = convertObjDefinitionToDefinitionData(initialDefinition, initialData);
  const rootDefinitionData : DefinitionData = {
    subtype: definitionData,
    keyName: "root",
    type: "object",
    value: initialData,
    required: true,
  };

  let selectedData : DefinitionData = rootDefinitionData;

  // May contain deep paths like "prop.innerProp"
  let workingDefinitionPath : Array<string> = [];
  let levelOverrideMap = new Map<number, EditorLevels>();
  let currentLevel = editingLevel;
  let levelsNames : string[] = [];

  const setWorkingDataAndLevel = () => {
    let lastValidLevel = editingLevel.level;
    for (let i = 1; i <= workingDefinitionPath.length; i ++) {
      lastValidLevel = levelOverrideMap.get(i) ?? lastValidLevel;
    }

    currentLevel = new EditorLevel(lastValidLevel);
    selectedData = selectDataDefinition();
  };

  const selectDataDefinition = () : DefinitionData => {
    const dicedDefinitionPath = [];
    workingDefinitionPath.forEach((path : string) => {
      const parts = path.split(".");
      dicedDefinitionPath.push(...parts);
    });

    let intermediarySelectedData = rootDefinitionData;
    for (let path of dicedDefinitionPath) {
      intermediarySelectedData = intermediarySelectedData[path];
    }

    return intermediarySelectedData;
  };

  const navigateTo = (path : string, levelOverride ?: EditorLevels) : void => {
    workingDefinitionPath.push(path);
    workingDefinitionPath = workingDefinitionPath;

    if (levelOverride !== undefined) {
      levelOverrideMap.set(workingDefinitionPath.length, levelOverride);
    }

    const intermediarySelectedData = selectDataDefinition();
    levelsNames.push(intermediarySelectedData.keyName);

    dispatch("navigation-event", { namePaths: levelsNames });

    setWorkingDataAndLevel();
  };

  export const goBackOneLevel = () => {
    levelOverrideMap.delete(workingDefinitionPath.length);

    workingDefinitionPath.pop();
    workingDefinitionPath = workingDefinitionPath;

    dispatch("navigation-event", { namePaths: levelsNames });

    setWorkingDataAndLevel();
  };

  export const navigateBackToLevel = (levelIndex : number) => {
    for (let i = workingDefinitionPath.length - 1; i >= levelIndex; i--) {
      levelOverrideMap.delete(workingDefinitionPath.length);
      levelsNames.pop();
    }

    workingDefinitionPath = workingDefinitionPath.slice(0, levelIndex);

    dispatch("navigation-event", { namePaths: levelsNames });

    setWorkingDataAndLevel();
  };

  export const getDefinitionAndData = () => {
    return convertDefinitionDataToObjectDefinition(rootDefinitionData);
  };

  export const getPathsNames = () => {
    return levelsNames;
  };

</script>

<div class="editor">
  <ObjectDefinitionEditor
    editingLevel={currentLevel}
    bind:workingData={selectedData}
    on:navigate-definition={(event) => { navigateTo(event.detail.path, event.detail.levelOverride); }}
  />
</div>


<style lang="scss">
  .editor {
    font-family: 'Dosis';
    font-size: 16px;
    display: flex;
    flex-flow: column nowrap;
  }
</style>