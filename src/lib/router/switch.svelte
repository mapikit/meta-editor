<script lang="ts">
import { onMount } from "svelte";

import { navigation } from "../navigation";

export let basePath;

let pathKey = new Date().getMilliseconds().toString();
let shouldRender = false;

navigation.pathStore.subscribe((pathChange) => {
  console.log(" >> Switch ", pathChange, basePath);
  if (navigation.pathsMatches(basePath, pathChange, true)) {
    navigation.setWorkingSwitchPath(basePath);
  }

  if (pathChange.startsWith(basePath) && navigation.activeSwitchPath == basePath) {
    shouldRender = true;
    pathKey = pathChange.slice(basePath.length);
  }
});

onMount(() => {
  navigation.setWorkingSwitchPath(basePath);

  const currentPath = navigation.currentPath;

  if (currentPath.startsWith(basePath) && navigation.activeSwitchPath == basePath) {
    shouldRender = true;
    pathKey = currentPath.slice(basePath.length);
  }
});
</script>

{#if shouldRender}
  {#key pathKey}
    <slot />
  {/key}
{/if}
