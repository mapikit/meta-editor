<script lang="ts">
  import { onMount } from "svelte";
  import type { Writable } from "svelte/store";

  export let field : Writable<string>;
  export let label : string;
  export let multiline = false;

  let content;

  const resizeTextArea = () : void => {
    if (!content) { return; }
    content.style.height = "auto";
    content.style.height = content.scrollHeight + 4 + "px";
  };

  onMount(() => {
    resizeTextArea();
  });
</script>

{#if !multiline}
<div class="w-full mt-2">
  <p class="text-offWhite text-sm"> {label} </p>
  <input bind:value={$field} class="outline-none rounded border border-norbalt-100 focus:border-offWhite transition-all bg-norbalt-350 w-full mt-1 px-1"/>
</div>
{:else}
<div class="w-full mt-2">
  <p class="text-offWhite text-sm"> {label} </p>
  <textarea bind:value={$field}
  class="outline-none rounded border border-norbalt-100 focus:border-offWhite transition-all bg-norbalt-350 w-full mt-1 px-1 resize-none"
  bind:this="{content}"
  on:input={resizeTextArea}/>
</div>
{/if}