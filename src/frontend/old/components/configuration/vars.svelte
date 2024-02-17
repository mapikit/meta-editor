<script lang="ts">
  import CrossIcon from "../../icons/cross-icon.svelte";
  import CancelIcon from "../../icons/cancel-icon.svelte";
  import PencilIcon from "../../icons/pencil-icon.svelte";
  import CheckIcon from "../../icons/check-icon.svelte";
  import type { Writable } from "svelte/store";
  import type { EnvironmentVariable } from "../../entities/environment-variable";
  import { createEventDispatcher } from "svelte";

  export let env : EnvironmentVariable;
  export let editingIndex : Writable<number>;
  export let index : number;
  let isHovering = false;

  const { key, value } = env;
  let newKey = $key;
  let newValue = $value;

  const dispatch = createEventDispatcher();

  $: canDelete = isHovering && $editingIndex === -1;
  $: editing = $editingIndex === index;
  $: inputClassNotEditing = !editing ? "border-transparent cursor-default" : "border-offWhite";
  $: transparencyClass = !canDelete ? "opacity-0 cursor-default": "opacity-100";
  
  let triedToEdit = false;

  const startEditing = () : void => {
    if ($editingIndex === -1) {
      editingIndex.set(index);
      return;
    }

    triedToEdit = true;
  };

  const cancel = () : void => {
    editingIndex.set(-1);
    newKey = $key;
    newValue = $value;
  };

  const commit = () : void => {
    editingIndex.set(-1);
    key.set(newKey);
    value.set(newValue);
    dispatch("updateVersion");
  };

  const removeVar = () : void => {
    if (!canDelete) { return; }
    editingIndex.set(-1);
    dispatch("remove", env);
  };
</script>

<div class="w-full flex flex-row items-center"
  on:mouseenter={() => {isHovering = true;}}
  on:mouseleave={() => {isHovering = false;}}
>
<div class="w-full rounded bg-norbalt-300 h-7 flex flex-row items-center overflow-hidden px-1.5">
  {#if editing}
    <div class="p-1 rounded bg-norbalt-200 w-5 h-5 transition-all hover:bg-norbalt-100 stroke-brightGreen hover:stroke-brightGreen-lighter cursor-pointer"
      on:click="{commit}"
    > <CheckIcon style="w-full h-full stroke-inherit" /> </div> <!-- confirm button-->
    <div class="p-1 rounded bg-norbalt-200 w-5 h-5 transition-all hover:bg-norbalt-100 stroke-ochreYellow hover:stroke-ochreYellow-light ml-1 cursor-pointer"
      on:click="{cancel}"
    > <CancelIcon style="w-full h-full stroke-inherit" /> </div> <!-- cancel button-->
  {:else}
    <div class="p-1 rounded bg-norbalt-200 w-5 h-5 transition-all hover:bg-norbalt-100 fill-offWhite hover:fill-white cursor-pointer"
      on:click="{startEditing}"
    > <PencilIcon style="w-full h-full fill-inherit" /> </div> <!-- edit button-->
  {/if}
  <input class="flex-1 h-6 transition-all text-md text-offWhite rounded border placeholder:text-norbalt-100 bg-transparent px-2 ml-2 outline-none focus:border-white focus:text-white {inputClassNotEditing}" bind:value="{newKey}" placeholder="Name*"
    disabled={!editing}
  />
  <input class="flex-1 h-6 transition-all text-md text-offWhite rounded border placeholder:text-norbalt-100 bg-transparent px-2 ml-2 outline-none focus:border-white focus:text-white {inputClassNotEditing}" bind:value="{newValue}" placeholder="Value*"
    disabled={!editing}
  />
</div>
<div class="p-1 rounded bg-norbalt-200 w-5 h-5 transition-all hover:bg-norbalt-100 stroke-roseRed hover:stroke-roseRed-light ml-2 cursor-pointer {transparencyClass}"
  on:click="{removeVar}"
> <CrossIcon style="w-full h-full stroke-inherit" /> </div> <!-- REMOVE button-->
</div>
