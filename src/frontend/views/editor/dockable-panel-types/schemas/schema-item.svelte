<script lang="ts">
  import { CaretDown } from "phosphor-svelte";
  import EditableToggleTextField from "../../../../components/text-fields/editable-toggle-text-field.svelte";
  import { SchemaStore } from "../../../../../entities/stores/schema-store";
  import { getContext } from "svelte";

  export let schema : SchemaStore;

  const currentPanel = getContext("current_panel");

  let { name } = schema;
  let open = false;
</script>

<div class="bg-norbalt-400 w-full rounded py-1.5 px-2.5 mt-2 first:mt-0">
  <div class="flex items-center">
    <button on:click={() => { open = !open; }}
      class="mr-1.5 text-offWhite font-black hover:text-white transition-all">
      <CaretDown class="{open ? "rotate-180" : ""} transition-all duration-150"/>
    </button>
    <EditableToggleTextField text={name} />
  </div>
</div>
