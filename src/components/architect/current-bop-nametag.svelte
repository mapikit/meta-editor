<script lang="ts">
  import type { UIBusinessOperation } from "../../entities/business-operation";
  import BopIcon from "../../icons/bop-icon.svelte";
  import { get } from "svelte/store";
  import PencilIcon from "../../icons/pencil-icon.svelte";
  import TextField from "../fields/text-field.svelte";

  export let businessOperation : UIBusinessOperation;

  $: name = get(businessOperation.name);

  let editing = false;
</script>

<div class="absolute mt-4 top-2 left-8 bg-norbalt-200 px-6 py-2 h-16 flex items-center justify-start rounded-md shadow">
  <BopIcon style="stroke-white fill-ochreYellow mr-4"/>
  
  {#if !editing}
    <div class="text-2xl font-bold"> {name} </div>
  {:else}
    <div class="ml-2 -mt-2">
      <TextField field={businessOperation.name} label="Business Operation Name"/>
    </div>
  {/if}
  <div class="fill-offWhite hover:fill-white ml-6 cursor-pointer" on:click="{() => { editing = !editing; }}">
    <PencilIcon style="fill-inherit transition-all h-6 w-4"/>
  </div>
</div>