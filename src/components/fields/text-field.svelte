<script lang="ts">
  import { onMount } from "svelte";
  import type { Writable } from "svelte/store";

  export let field : Writable<string>;
  export let label : string = undefined;
  export let placeholder = "";
  export let multiline = false;
  export let onChange = () => {};

  let content;

  const resizeTextArea = () : void => {
    if (!content) { return; }
    content.style.height = "auto";
    content.style.height = content.scrollHeight + 4 + "px";
  };

  onMount(() => {
    resizeTextArea();
  });

  $: fieldMtNoLabel = label === undefined ? "" : "mt-1";
</script>

{#if !multiline}
<div class="w-full mt-2">
  {#if label !== undefined}
     <p class="text-offWhite text-sm"> {label} </p>
  {/if}
  <input
    placeholder="{placeholder}"
    on:input={onChange}
    bind:value={$field} class="outline-none rounded border border-norbalt-100 focus:border-offWhite transition-all bg-norbalt-350 w-full {fieldMtNoLabel} px-1"/>
</div>
{:else}
<div class="w-full mt-2">
  {#if label !== undefined}
    <p class="text-offWhite text-sm"> {label} </p>
  {/if}
  <textarea bind:value={$field}
  class="outline-none rounded border border-norbalt-100 focus:border-offWhite transition-all bg-norbalt-350 w-full {fieldMtNoLabel} px-1 resize-none"
  bind:this="{content}"
  on:input={resizeTextArea}/>
</div>
{/if}