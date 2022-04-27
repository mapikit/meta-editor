<script lang="ts">
import { navigation } from "../navigation";

export let basePath = "/";

let pathKey = new Date().getMilliseconds().toString();
let shouldRender = false;

navigation.pathStore.subscribe((pathChange) => {
  if (pathChange.startsWith(basePath)) {
    shouldRender = true;
    pathKey = pathChange.slice(basePath.length);
  }
});
</script>

{#if shouldRender}
  {#key pathKey}
    <slot />
  {/key}
{/if}
