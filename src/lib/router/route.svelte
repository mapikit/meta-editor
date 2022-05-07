<script lang="ts">
import { onMount } from "svelte";

import { navigation } from "../navigation";

export let path;
export let deepMatch = false;

onMount(() => {
  navigation.registerPath(path);
});

let shouldRender = navigation.isCurrentPath(path, deepMatch);

</script>

{#if shouldRender}
  <slot />
{/if}