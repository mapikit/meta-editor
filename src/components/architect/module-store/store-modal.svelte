<script lang="ts">
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";

const storeModalContent = getContext<Writable<string>>("storeModalContent");
</script>

<div class="h-full w-full">
  {#if $storeModalContent === "createConstant"}
    SHOULD SHOW CREATE CONSTANT
  {:else}
    this is an Error, contact administrators.
  {/if}
</div>