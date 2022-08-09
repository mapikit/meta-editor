<script lang="ts">
  import type { Writable } from "svelte/store";

  export let field : Writable<string>;
  export let label : string;
</script>

<div class="w-full mt-2">
  <p class="text-offWhite text-sm"> {label} </p>
  <input bind:value={$field} class="outline-none rounded border border-offWhite focus:border-white transition-all bg-norbalt-350 w-full mt-1 px-1"/>
</div>