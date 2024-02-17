<script lang="ts">
  import { onMount } from "svelte";
  import type { Writable } from "svelte/store";

  export let field : Writable<string>;
  export let label : string = undefined;
  export let placeholder = "";
  export let multiline = false;
  export let onChange = () : void => {};
  export let invalid = false;
  export let stopPropagation = true;

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
  $: invalidBorder = invalid ? "border-roseRed" : "border-norbalt-100 focus:border-offWhite";
</script>

{#if !multiline}
<div class="w-full mt-2">
  {#if label !== undefined}
     <p class="text-offWhite text-sm"> {label} </p>
  {/if}
  <input
    on:keydown={stopPropagation ? (e) => { e.stopPropagation(); } : undefined}
    on:keyup={stopPropagation ? (e) => { e.stopPropagation(); } : undefined}
    placeholder="{placeholder}"
    on:input={onChange}
    bind:value={$field} class="outline-none rounded border {invalidBorder} transition-all bg-norbalt-350 w-full {fieldMtNoLabel} px-1"/>
</div>
{:else}
<div class="w-full mt-2">
  {#if label !== undefined}
    <p class="text-offWhite text-sm"> {label} </p>
  {/if}
  <textarea bind:value={$field}
  class="outline-none rounded border {invalidBorder} transition-all bg-norbalt-350 w-full {fieldMtNoLabel} px-1 resize-none"
  bind:this="{content}"
  on:input={() => { resizeTextArea(); onChange(); }}/>
</div>
{/if}