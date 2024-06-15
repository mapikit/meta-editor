<script lang="ts">
  import { ArrowSquareOut, CaretDown, CopySimple, TrashSimple } from "phosphor-svelte";
  import EditableToggleTextField from "../../../../components/text-fields/editable-toggle-text-field.svelte";
  import { SchemaStore } from "../../../../../entities/stores/schema-store";
  import { getContext } from "svelte";
  import SchemaActionButton from "./schema-action-button.svelte";
  import { DockController } from "../../../../../entities/controllers/dock-controller";
  import { PanelStore } from "../../../../../entities/stores/panels-store";

  export let schema : SchemaStore;

  const currentPanel = getContext<PanelStore>("current_panel");

  let { name } = schema;
  let open = false;

  const editSchemaFunction = () : void => {
    DockController.changeView(currentPanel, "Configure Schema", schema.identifier);
  };
</script>

<div class="bg-norbalt-400 w-full rounded py-1.5 px-2.5 mt-2 first:mt-0">
  <div class="flex items-center">
    <button on:click={() => { open = !open; }}
      class="mr-1.5 text-offWhite font-black hover:text-white transition-all">
      <CaretDown class="{open ? "" : "-rotate-180"} transition-all"/>
    </button>
    <EditableToggleTextField text={name} />
    <div class="flex px-1 ml-2 py-1 bg-norbalt-300 rounded">
      <SchemaActionButton tooltipText="Duplicate Schema" action={() => {}} class="hover:text-ochreYellow">
        <CopySimple />
      </SchemaActionButton>
      <SchemaActionButton tooltipText="Edit Schema" action={editSchemaFunction} class="hover:text-brightGreen">
        <ArrowSquareOut />
      </SchemaActionButton>
      <SchemaActionButton tooltipText="Remove Schema" action={() => {}} class="hover:text-roseRed">
        <TrashSimple />
      </SchemaActionButton>
    </div>
  </div>
</div>
