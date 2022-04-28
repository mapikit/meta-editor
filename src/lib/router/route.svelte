<script lang="ts">
import { onMount } from "svelte";

import { navigation } from "../navigation";

export let path;
export let deepMatch = false;

onMount(() => {
  navigation.registerPath(path);
});

</script>

{#if navigation.isCurrentPath(path, deepMatch)}
  <slot />
{/if}