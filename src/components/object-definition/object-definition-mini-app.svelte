<script lang="ts">
  import { createEventDispatcher, onDestroy } from "svelte";
  import type { ObjectDefinition } from "@meta-system/object-definition";
  import {
    convertDefinitionDataToObjectDefinition,
    convertObjDefinitionToDefinitionData,
    DefinitionData,
  } from "./obj-def-converter";
  import { EditorLevel, EditorLevels } from "./obj-def-editor-types-and-helpers";
  import ObjectDefinitionEditor from "./object-definition-editor.svelte";
  import ArrowIcon from "../../icons/arrow-icon.svelte";
  import { writable, Writable } from "svelte/store";
  import deepClone from "deep-clone";
  import ChevronIcon from "../../icons/chevron-icon.svelte";

  // Default mode is Creating an Obj Definition
  export let editingLevel : EditorLevel = new EditorLevel(EditorLevels.createAndSignDefinition);
  export let format : Writable<ObjectDefinition>;
  export let rootStyle = "mt-4 bg-norbalt-300 rounded";

  const dispatch = createEventDispatcher();

  export let initialData : object;

  let definitionData : DefinitionData[] = convertObjDefinitionToDefinitionData(deepClone($format), initialData);
  const rootDefinitionData : Writable<DefinitionData> = writable({
    subtype: definitionData,
    keyName: "root",
    type: "object",
    value: initialData,
    required: true,
  });

  const selectedData : Writable<DefinitionData> = writable($rootDefinitionData);

  const unsub = selectedData.subscribe(() => {
    if (!format) { return; }
    format.set(convertDefinitionDataToObjectDefinition($rootDefinitionData).definition["root"]["subtype"]);
  });

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
    selectedData.set(selectDataDefinition());
  };

  const selectDataDefinition = () : DefinitionData => {
    const dicedDefinitionPath = [];
    workingDefinitionPath.forEach((path : string) => {
      const parts = path.split(".");
      dicedDefinitionPath.push(...parts);
    });

    let intermediarySelectedData = $rootDefinitionData;
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
    levelsNames = levelsNames;

    dispatch("navigation-event", { namePaths: levelsNames });

    setWorkingDataAndLevel();
  };

  export const goBackOneLevel = () => {
    navigateBackToLevel(workingDefinitionPath.length - 1);
    setWorkingDataAndLevel();
  };

  export const navigateBackToLevel = (levelIndex : number) => {
    for (let i = workingDefinitionPath.length - 1; i >= levelIndex; i--) {
      levelOverrideMap.delete(workingDefinitionPath.length);
      levelsNames.pop();
      levelsNames = levelsNames;
    }

    workingDefinitionPath = workingDefinitionPath.slice(0, levelIndex);

    dispatch("navigation-event", { namePaths: levelsNames });

    setWorkingDataAndLevel();
  };

  export const getDefinitionAndData = () => {
    return convertDefinitionDataToObjectDefinition($rootDefinitionData);
  };

  export const getPathsNames = () => {
    return levelsNames;
  };

  onDestroy(() => {
    unsub();
  });

</script>

<div class="{rootStyle}">
  <div class="bg-norbalt-350 py-2 px-4 rounded-t h-9 flex flex-row items-center mb-3"> <!-- Header BreadCrumb -->
    {#if levelsNames.length >= 1}
      <div class="h-5 w-2.5 mr-2 cursor-pointer" on:click="{() => { goBackOneLevel(); }}">
        <ArrowIcon style="stroke-white rotate-180 h-5 w-2.5"/>
      </div>
    {/if}
    {#each levelsNames as level, index}
      <div class="flex flex-row ml-2 first:ml-0 items-center text-lg text-offWhite last:text-white hover:text-white transition-all cursor-pointer"
        on:click="{() => navigateBackToLevel(index + 1)}"
      >
        {#if index !== 0}
          <ChevronIcon style="stroke-white -rotate-90"/>
        {/if}
        <p class="ml-1"> {level} </p>
      </div>
    {/each}
  </div>
  <ObjectDefinitionEditor
    editingLevel={currentLevel}
    workingData={selectedData}
    on:navigate-definition={(event) => { navigateTo(event.detail.path, event.detail.levelOverride); }}
  />
</div>
