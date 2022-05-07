<script lang="ts">
import { onMount } from "svelte";
import { navigation } from "../navigation";

export let basePath : string;
export let ignoreParamChanges = false;

let pathKey = "";
let shouldRender = false;

// eslint-disable-next-line max-lines-per-function
const setPathKey = (newPath : string) : void => {
  const basePathSteps = basePath.split("/");
  const newPathSteps = newPath.split("/");
  const paramsIndexes = [];

  let lastFoundIndex = basePathSteps.findIndex((step) => step.startsWith(":"));
  while (lastFoundIndex >= 0) {
    basePathSteps.splice(lastFoundIndex, 1);
    paramsIndexes.push(lastFoundIndex);
    lastFoundIndex = basePathSteps.findIndex((step) => step.startsWith(":"));
  }

  let checkingIndexes = newPathSteps.map((item, index) => index);
  if (ignoreParamChanges) {
    paramsIndexes.forEach((index) => {
      const indexToBeRemovedIndex = checkingIndexes.findIndex((checkedIndex) => checkedIndex === index);
      checkingIndexes.splice(indexToBeRemovedIndex, 1);
    });
  }

  let result = checkingIndexes.reduce((finalPath, current) => {
    return finalPath + newPathSteps[current];
  }, "");

  if (result !== pathKey) { pathKey = result; }
};

navigation.pathStore.subscribe((pathChange) => {
  if (navigation.pathsMatches(basePath, pathChange, true)) {
    navigation.setWorkingSwitchPath(basePath);
  }

  if (navigation.activeSwitchPath == basePath) {
    shouldRender = true;
    setPathKey(pathChange);
  }
});

onMount(() => {
  navigation.setWorkingSwitchPath(basePath);

  const currentPath = navigation.currentPath;

  if (navigation.activeSwitchPath == basePath) {
    shouldRender = true;
    setPathKey(currentPath);
  }
});
</script>

{#if shouldRender}
  {#key pathKey}
    <slot />
  {/key}
{/if}
