<script lang="ts">
import { onMount } from "svelte";

import { navigation } from "../navigation";

export let path;

let currentPath = "";

navigation.pathStore.subscribe((newPath) => {
  currentPath = newPath;
});

onMount(() => {
  navigation.registerPath(path);
});

</script>

{#if navigation.isCurrentPath(path)}
  <slot />
{/if}