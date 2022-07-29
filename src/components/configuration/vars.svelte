<script lang="ts">
  import CrossIcon from "../../icons/cross-icon.svelte";
  import CancelIcon from "../../icons/cancel-icon.svelte";
  import PencilIcon from "../../icons/pencil-icon.svelte";
  import CheckIcon from "../../icons/check-icon.svelte";

  export let varName = "someName";
  export let varValue = "aValue";

  let editing = false;

  $: inputClassNotEditing = !editing ? "border-transparent cursor-default" : "";
</script>

<div class="w-full flex flex-row items-center">
<div class="w-full rounded bg-norbalt-300 h-7 flex flex-row items-center overflow-hidden px-1.5">
  {#if editing}
    <div class="p-1 rounded bg-norbalt-200 w-5 h-5 transition-all hover:bg-norbalt-100 stroke-brightGreen hover:stroke-brightGreen-lighter"
      on:click="{() => { editing = false; }}"
    > <CheckIcon style="w-full h-full stroke-inherit" /> </div> <!-- confirm button-->
    <div class="p-1 rounded bg-norbalt-200 w-5 h-5 transition-all hover:bg-norbalt-100 stroke-ochreYellow hover:stroke-ochreYellow-light ml-1"
      on:click="{() => { editing = false; }}"
    > <CancelIcon style="w-full h-full stroke-inherit" /> </div> <!-- cancel button-->
  {:else}
    <div class="p-1 rounded bg-norbalt-200 w-5 h-5 transition-all hover:bg-norbalt-100 fill-offWhite hover:fill-white"
      on:click="{() => { editing = true; }}"
    > <PencilIcon style="w-full h-full fill-inherit" /> </div> <!-- edit button-->
  {/if}
  <input class="flex-1 h-5 transition-all text-md text-offWhite rounded border placeholder:text-norbalt-100 border-offWhite bg-transparent px-2 ml-2 outline-none focus:border-white focus:text-white {inputClassNotEditing}" bind:value="{varName}" placeholder="Name*"
    disabled={!editing}
  />
  <input class="flex-1 h-5 transition-all text-md text-offWhite rounded border placeholder:text-norbalt-100 border-offWhite bg-transparent px-2 ml-2 outline-none focus:border-white focus:text-white {inputClassNotEditing}" bind:value="{varValue}" placeholder="Name*"
    disabled={!editing}
  />
</div>
<div class="p-1 rounded bg-norbalt-200 w-5 h-5 transition-all hover:bg-norbalt-100 stroke-roseRed hover:stroke-roseRed-light ml-2"
  on:click="{() => { editing = false; }}"
> <CrossIcon style="w-full h-full stroke-inherit" /> </div> <!-- edit button-->
</div>
