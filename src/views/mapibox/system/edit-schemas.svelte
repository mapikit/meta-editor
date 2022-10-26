<script lang="ts">
  import { get } from "svelte/store";
  import { getSchemaById, protocols, schemas, setSchema } from "../../../stores/configuration-store";
  import { navigation } from "../../../lib/navigation";
  import { onMount, onDestroy } from "svelte";
  import ConfigurationSection from "../../../components/configuration/configuration-section.svelte";
  import ChevronIcon from "../../../icons/chevron-icon.svelte";
  import TextField from "../../../components/fields/text-field.svelte";
  import Selector from "../../../components/common/selector.svelte";
  import ObjectDefinitionMiniApp from "../../../components/object-definition/object-definition-mini-app.svelte";
  import { EditorLevel, EditorLevels } from "../../../components/object-definition/obj-def-editor-types-and-helpers";
	import ConfirmCancelButton from "./confirm-cancel-button.svelte";
	import { storageManager } from "../../../stores/storage-manager";
	import type { Serialized } from "../../../entities/serialized-type";
	import { Schema } from "../../../entities/schema";

  let pathParams = navigation.currentPathParamsSubscribable;

  $: schemaList = $schemas;
  $: versionId = $pathParams.configurationId
  $: currentSchemaId = $pathParams["schemaId"];
  $: currentSchema = getSchemaById(currentSchemaId);
  $: schemaFormat = $currentSchema?.format;
  $: schemaName = $currentSchema?.name;
  $: description = $currentSchema?.description;
  $: dbprotocol = $currentSchema?.dbProtocol;
  $: protocolsOptions = $protocols
    .map((protocol) => ({ value: get(protocol.identifier), label: get(protocol.protocolName) }));

  $: selectedProtocolLabel = protocolsOptions.find((protocol) => protocol.value === $dbprotocol)?.label;

  let unsub = () : void => { void 0; };
  let unsubSchema = () : void => { void 0; };
  let editted = false;
  let previousSchemaState : Serialized<Schema> = undefined;

  onDestroy(() => { unsub(); unsubSchema() });
  // eslint-disable-next-line max-lines-per-function
  onMount(() => {
    console.log("Mounted");
    const currentPathParams = navigation.currentPathParams;
    // pathParams = navigation.currentPathParamsSubscribable;
    currentSchemaId = currentPathParams["schemaId"];
    console.log(currentSchemaId)
    currentSchema = getSchemaById(currentSchemaId);
    console.log(currentSchema, "(equates to)", get(currentSchema), "or", $currentSchema)
    previousSchemaState = get(currentSchema)?.serialized();
    console.log(previousSchemaState)

    unsub = pathParams.subscribe(() => {
      currentSchemaId = navigation.currentPathParams["schemaId"];
      versionId = navigation.currentPathParams["configurationId"];
      currentSchema = getSchemaById(currentSchemaId);
      previousSchemaState = $currentSchema?.serialized();
    });
  });

  function saveSchema () {
    storageManager.manager.updateSchema(versionId, get(currentSchema));
    previousSchemaState = $currentSchema.serialized();
    editted = false;
  }

  function cancelEdit () {
    console.log(previousSchemaState);
    const previous = new Schema(previousSchemaState);
    setSchema(previous);
    editted = false;
  }
</script>

<div class="px-8 w-[calc(100%-86px)] overflow-y-scroll pb-36">
  <ConfigurationSection type="Schemas" canDelete={true}/>
  <div class="w-full mt-12" >
    <p class="text-white font-bold text-2xl italic"> Editing '{$schemaName}' Schema</p>
    <div class="flex flex-row w-full mt-4"> <!-- Card holder -->
      <div class="rounded bg-norbalt-200 p-3 px-5 border-transparent border w-[550px]">
        <div /> <!-- Confirm / Cancel -->
        <div class="flex flex-row justify-between items-center text-lg font-semibold"> <!-- Information Section -->
          <ChevronIcon />
          <p class="ml-3">  Information </p>
          <div class="flex-1 ml-6 h-0.5 bg-norbalt-100"/> {#if editted}
            <ConfirmCancelButton onConfirm={saveSchema} onCancel={cancelEdit}/>
          {/if}
        </div>
        <TextField label="Name" bind:field={schemaName} onChange={() => editted = true}/>
        <TextField label="Description" bind:field={description} multiline onChange={() => editted = true}/>
        <div class="mt-2 w-full">
          <p class="text-offWhite text-sm"> Db Protocol </p>
          <div class="mt-1">
            <Selector bind:field={$dbprotocol} options={protocolsOptions} selectedLabel={selectedProtocolLabel} onChange={() => editted = true}/>
          </div>
        </div>
        <div class="flex flex-row justify-between items-center text-lg font-semibold mt-4"> <!-- Format Section -->
          <ChevronIcon />
          <p class="ml-3">  Format </p>
          <div class="flex-1 ml-6 h-0.5 bg-norbalt-100"/>
        </div>
        {#key currentSchemaId}
          {#if $schemaFormat} <!-- this ensures the mini app is not rendered with bad values -->
            <ObjectDefinitionMiniApp
            editingLevel={new EditorLevel(EditorLevels.createDefinition)}
            format={schemaFormat}
            initialData={{}}
            />
          {/if}
        {/key}
      </div>
    </div>
  </div>
</div>