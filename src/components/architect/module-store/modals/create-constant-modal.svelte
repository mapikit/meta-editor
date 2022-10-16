<script lang="ts">
  import { writable } from "svelte/store";
  import CheckIcon from "../../../../icons/check-icon.svelte";
  import CancelIcon from "../../../../icons/cancel-icon.svelte";
  import TextField from "../../../../components/fields/text-field.svelte";
  import Selector from "../../../../components/common/selector.svelte";
  import BooleanField from "../../../../components/object-definition/editing-fields/boolean-field.svelte";
  import DateField from "../../../../components/object-definition/editing-fields/date-field.svelte";

  const name = writable("");
  const type = writable("string");
  const typeOptions = [
    { label: "String", value: "string" },
    { label: "Number", value: "number" },
    { label: "Boolean", value: "boolean" },
    { label: "Object", value: "object" },
    { label: "Date", value: "date" },
  ];

  const value = writable<unknown>("");
</script>

<div class="flex flex-row justify-between">
  <div class="text-white font-bold text-lg"> Create New Constant </div>
  <div class="flex flex-row">
    <div class="h-full w-7 flex justify-center items-center rounded transition-all border-transparent hover:border-brightGreen border stroke-offWhite hover:stroke-brightGreen cursor-pointer"> <CheckIcon style="stroke-inherit"/> </div>
    <div class="ml-2 h-full w-7 flex justify-center items-center rounded border transition-all border-transparent hover:border-ochreYellow stroke-offWhite hover:stroke-ochreYellow cursor-pointer"> <CancelIcon style="stroke-inherit"/> </div>
  </div>
</div>
<TextField field="{name}" label="Name" />
<div class="mt-2">
  <p class="text-offWhite text-sm mb-1"> Type </p>
  <Selector bind:field={$type} options="{typeOptions}"/>
</div>
{#if $type === "object"}
  <div class="mt-4 text-center bg-norbalt-200 text-offWhite hover:text-white hover:bg-norbalt-100 transition-all w-20 rounded cursor-pointer text-md"> Set Value </div>
{:else if $type === "string"}
  <TextField field={value} label="Value" placeholder=""/>
{:else if $type === "number"}
  <div class="mt-2">
    <p class="text-offWhite text-sm mb-1"> Value </p>
    <input
      bind:value={$value} type="number" class="outline-none app rounded border border-norbalt-100 focus:border-offWhite transition-all bg-norbalt-350 w-full px-1"/>
  </div>
{:else if $type === "boolean"}
  <div class="mt-2">
    <p class="text-offWhite text-sm mb-1"> Value </p>
    <div class="bg-norbalt-300 rounded">
      <BooleanField bind:propValue={$value}/>
    </div>
  </div>
{:else if $type === "date"}
  <div class="mt-2">
    <p class="text-offWhite text-sm mb-1"> Value </p>
    <div class="bg-norbalt-300 rounded">
      <DateField bind:propValue={$value}/>
    </div>
  </div>
{/if}