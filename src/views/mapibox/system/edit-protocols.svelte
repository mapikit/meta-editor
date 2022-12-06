<script lang="ts">
  import { get, writable } from "svelte/store";
  import { getProtocolById, protocols } from "../../../stores/configuration-store";
  import { navigation } from "../../../lib/navigation";
  import { onMount, onDestroy } from "svelte";
  import ConfigurationSection from "../../../components/configuration/configuration-section.svelte";
  import ChevronIcon from "../../../icons/chevron-icon.svelte";
  import TextField from "../../../components/fields/text-field.svelte";
  import ObjectDefinitionMiniApp from "../../../components/object-definition/object-definition-mini-app.svelte";
  import { EditorLevel, EditorLevels } from "../../../components/object-definition/obj-def-editor-types-and-helpers";
  import ProtocolPicker from "../../../components/modal/protocol-picker.svelte";
  import PencilIcon from "../../../icons/pencil-icon.svelte";
  import { ProtocolKind } from "meta-system/dist/src/configuration/protocols/protocols-type";
	import ConfirmCancelButton from "./confirm-cancel-button.svelte";
	import { storageManager } from "../../../stores/storage-manager";
	import { Protocol } from "../../../entities/protocol";
	import type { Serialized } from "../../../entities/serialized-type";

  let pathParams = navigation.currentPathParamsSubscribable;

  $: versionId = $pathParams.configurationId
  $: currentProtocolId = $pathParams["protocolId"];
  $: currentProtocol = getProtocolById(currentProtocolId);
  $: protocolFormat = $currentProtocol?.configuration;
  $: protocolName = $currentProtocol?.protocolName;
  $: description = $currentProtocol?.description;
  $: definition = $currentProtocol?.definition;
  $: identifier = $currentProtocol?.identifier;
  $: version = $currentProtocol?.protocolVersion;
  $: protocolType = $currentProtocol?.protocolType;

  let previousProtocolState : Serialized<Protocol, "definition"> = undefined;

  let unsub = () : void => { void 0; };

  onDestroy(() => { 
    currentProtocol.set(new Protocol(previousProtocolState));
    unsub();
  });
  // eslint-disable-next-line max-lines-per-function
  onMount(() => {
    const currentPathParams = navigation.currentPathParams;
    // pathParams = navigation.currentPathParamsSubscribable;
    currentProtocolId = currentPathParams["protocolId"];
    previousProtocolState = get(currentProtocol)?.serialized();

    unsub = pathParams.subscribe(() => {
      currentProtocolId = navigation.currentPathParams["protocolId"];
      currentProtocol = getProtocolById(currentProtocolId);
    });
  });

  let openModal = () : void => {};

  let editted = false;
  function saveProtocol () {
    storageManager.manager.updateProtocol(versionId, get(currentProtocol))
      .catch(err => { window.alert("Error while saving protocol\n" + err)})
      .then(() => {
        previousProtocolState = $currentProtocol.serialized();
        currentProtocol.set($currentProtocol)
        editted = false;
      })
  }

  let rerender = false;
  function cancelEdit () {
    const previous = new Protocol(previousProtocolState);
    currentProtocol.set(previous);
    rerender = !rerender;
    editted = false;
  }

</script>

<div class="px-8 w-[calc(100%-86px)] overflow-y-scroll pb-36">
  <ConfigurationSection type="Protocols" canDelete={true}/>
  <div class="w-full mt-12" >
    <p class="text-white font-bold text-2xl italic"> Editing '{$protocolName}' </p>
    <div class="flex flex-row w-full mt-4"> <!-- Card holder -->
      <div class="rounded bg-norbalt-200 p-3 px-5 border-transparent border w-[550px]">
        <div /> <!-- Confirm / Cancel -->
        <div class="flex flex-row justify-between items-center text-lg font-semibold"> <!-- Information Section -->
          <ChevronIcon />
          <p class="ml-3">  Information </p>
          <div class="flex-1 ml-6 h-0.5 bg-norbalt-100"/>{#if editted}
            <ConfirmCancelButton  onCancel={cancelEdit} onConfirm={saveProtocol}/>{/if}
        </div>
        <TextField label="Name" bind:field={protocolName} onChange={() => editted = true}/>
        <TextField label="Description" bind:field={description} multiline onChange={() => editted = true}/>
        <div class="mt-2 w-full">
          <p class="text-offWhite text-sm"> Chosen Protocol </p>
          <div class="mt-1 flex flex-row items-center border-norbalt-100 hover:border-offWhite px-2 py-0.5 border rounded bg-norbalt-400 transition-all max-w-fit cursor-pointer fill-offWhite hover:fill-white" on:click="{openModal}">
            <p>
              {#if $protocolType === ProtocolKind.dbProtocol}
                <span class="text-roseRed"> DB </span> -
              {/if}
              {$identifier} [{$version}] </p> <PencilIcon style="ml-2 fill-inherit" />
          </div>
        </div>
        <ProtocolPicker bind:openModal onSelect={() => editted = true}/>
        <div class="flex flex-row justify-between items-center text-lg font-semibold mt-4"> <!-- Format Section -->
          <ChevronIcon />
          <p class="ml-3">  Protocol Configuration </p>
          <div class="flex-1 ml-6 h-0.5 bg-norbalt-100"/>
        </div>
        {#key currentProtocolId}
          {#if $protocolFormat} <!-- this ensures the mini app is not rendered with bad values -->
            <ObjectDefinitionMiniApp
            editingLevel={new EditorLevel(EditorLevels.signDefinition)}
            format={writable(definition)}
            initialData={$protocolFormat}
            onChange={() => editted = true}
            />
          {/if}
        {/key}
      </div>
    </div>
  </div>
</div>
