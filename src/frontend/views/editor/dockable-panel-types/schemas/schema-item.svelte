<script lang="ts">
  import { CaretDown } from "phosphor-svelte";
  import { Schema } from "../../../../../entities/models/schema";
  import EditableToggleTextField from "../../../../components/text-fields/editable-toggle-text-field.svelte";
  import { Writable, writable } from "svelte/store";
  import { onMount } from "svelte";

  export let schema : Schema;
  export let schemaName : Writable<string> = writable("");

  let open = false;

  onMount(() => {
    schemaName.set(schema.name);
  });
</script>

<div class="bg-norbalt-400 w-full rounded py-1.5 px-2.5 mt-2 first:mt-0">
  <div class="flex items-center">
    <button on:click={() => { open = !open; }}
      class="mr-1.5 text-offWhite font-black hover:text-white transition-all">
      <CaretDown />
    </button>
    <EditableToggleTextField text={schemaName} onSubmit={() => { schema.name = $schemaName; }}/>
  </div>
</div>
