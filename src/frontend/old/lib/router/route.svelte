<script lang="ts">
import { onDestroy } from "svelte";

import { navigation } from "../navigation";

export let path;
export let deepMatch = false;
export let onEnter : () => void = () => { /* placeholder */ };
let shouldRender = false;

navigation.registerPath(path);

const unsubscriber = navigation.pathStore.subscribe(() => {
  shouldRender = navigation.isCurrentPath(path, deepMatch);

  if (shouldRender) { onEnter(); }
});

onDestroy(() => {
  unsubscriber();
  navigation.unregisterPath(path);
});

</script>

{#if shouldRender}
  <slot />
{/if}