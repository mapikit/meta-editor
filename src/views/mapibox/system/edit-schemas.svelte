<script lang="ts">
  import DefinitionApp from "../../../components/system-page/system-editor/definition-app.svelte";
  import GuideText from "../../../components/common/guide-text.svelte";
  import { EditorLevels } from "../../../components/object-definition/obj-def-editor-types-and-helpers";
  import type { Schema } from "../../../entities/schema";
  import { get, writable } from "svelte/store";
  import { getSchemaById, protocols, schemas } from "../../../stores/configuration-store";
  import { navigation } from "../../../lib/navigation";
  import { onDestroy, onMount } from "svelte";
  import ConfigurationSection from "../../../components/configuration/configuration-section.svelte";
  import ChevronIcon from "../../../icons/chevron-icon.svelte";
  import TextField from "../../../components/fields/text-field.svelte";
  import Selector from "../../../components/common/selector.svelte";

  let schemaList : Schema[] = $schemas;

  $: pathParams = navigation.currentPathParamsSubscribable;
  $: schemaList = $schemas;
  $: currentSchemaId = $pathParams["schemaId"];
  $: currentSchema = getSchemaById(currentSchemaId);
  $: schemaFormat = $currentSchema?.format;
  $: schemaName = $currentSchema?.name;
  $: description = $currentSchema?.description;
  $: dbprotocol = $currentSchema?.dbProtocol ?? writable("");
  $: protocolsOptions = $protocols
    .map((protocol) => ({ value: get(protocol.identifier), label: get(protocol.protocolName) }));

  // onDestroy(unsub);
  onMount(() => {
    const currentPathParams = navigation.currentPathParams;
    currentSchemaId = currentPathParams["schemaId"];
  });

</script>

<div class="px-8 w-[calc(100%-86px)]">
  <ConfigurationSection type="Schemas" canDelete={true}/>
  <div class="w-full mt-12" >
    <p class="text-white font-bold text-2xl italic"> Editing '{$schemaName}' Schema </p>
    <div class="flex flex-row w-full mt-4"> <!-- Card holder -->
      <div class="rounded bg-norbalt-200 p-3 px-5 border-transparent border w-[550px]">
        <div /> <!-- Confirm / Cancel -->
        <div class="flex flex-row justify-between items-center text-lg font-semibold"> <!-- Information Section -->
          <ChevronIcon />
          <p class="ml-3">  Information </p>
          <div class="flex-1 ml-6 h-0.5 bg-norbalt-100"/>
        </div>
        <TextField label="Name" bind:field={schemaName}/>
        <TextField label="Description" bind:field={description} multiline/>
        <div class="mt-2 w-full">
          <p class="text-offWhite text-sm"> Db Protocol  </p>
          <div class="mt-1">
            <Selector bind:field={$dbprotocol} options={protocolsOptions}/>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
