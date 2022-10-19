<script lang="ts">
  import type { ObjectDefinition, TypeDefinition } from "@meta-system/object-definition";
  import type { TypeDefinitionDeep } from "@meta-system/object-definition/dist/src/object-definition-type";
  import type { BopsConfigurationEntry, BopsConstant }
    from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import ChevronIcon from "../../../../icons/chevron-icon.svelte";
  import { get, Writable } from "svelte/store";
  import ArrayDefinitionEditor from "../../../object-definition/array-definition-editor.svelte";
  import EditingField from "../../../object-definition/editing-fields/editing-field.svelte";
  import type { DefinitionData } from "../../../object-definition/obj-def-converter";
  import ObjectDefinitionMiniApp from "../../../object-definition/object-definition-mini-app.svelte";
  import TypeSelect from "../../../object-definition/type-select.svelte";
  import DropdownIcon from "../dropdown-icon.svelte";
  import StoreConstant from "../module-components/store-constant.svelte";
  import { getContext, setContext } from "svelte";
  import type { UIBusinessOperation } from "../../../../entities/business-operation";

  export let bopModules : Writable<BopsConfigurationEntry[]>;
  
  let bopConstants : Writable<BopsConstant[]>;
  
  bopConstants = getContext<UIBusinessOperation>("currentBop").constants;

  let addingConst = true;
  let storeModalOpen = getContext<Writable<boolean>>("storeModalOpen");
  let storeModalContent = getContext<Writable<string>>("storeModalContent");
  let newConstName = "";
  let selectedType : string = undefined;
  let selectedSubtype = undefined;
  let selectedValue : unknown = undefined;

  let arrayData : DefinitionData = undefined;

  $: arrayData = {
    keyName: newConstName,
    required: false,
    type: selectedType,
    subtype: selectedSubtype,
    value: [],
  };


  let MiniApp;

  function startAddingConst () : void {
    newConstName = `Constant${$bopConstants.length + 1}`;
    addingConst = true;
  }

  // eslint-disable-next-line max-lines-per-function
  function confirmNewConst () : void {
    let newConst : Partial<TypeDefinition<{ name : string, value : unknown }>> = { name: newConstName };
    switch (selectedType) {
      case "object":
        const definition = MiniApp.getDefinitionAndData();
        newConst.type = "object";
        (newConst as TypeDefinitionDeep).subtype = definition.definition["root"]["subtype"];
        newConst.value = definition.data["root"];
        break;
      case "array":
        newConst.type = "array";
        (newConst as TypeDefinitionDeep).subtype = arrayData.subtype as string | ObjectDefinition;
        newConst.value = arrayData.value;
        break;
      default:
        newConst.type = selectedType;
        newConst.value = selectedValue;
        break;
    }
    bopConstants.update(constants => {
      constants.push(newConst as BopsConstant);
      return constants;
    });
    addingConst = false;
  }

</script>

<div class="constantStore">
  <div class="w-full flex flex-col mt-1 first:mt-0">
    <div class="w-full flex flex-row items-center">
      <span class="mr-2"> Values </span>
      <div class="flex-1 h-[1px] bg-norbalt-100"/>
      <div class="ml-1.5 rounded bg-norbalt-350 text-xs text-offWhite px-2 py-1 cursor-pointer hover:text-white transition-all"
        on:click={() => { storeModalOpen.set(true); storeModalContent.set("createConstant"); }}
      > Create New </div>
    </div>
  </div>

  {#each $bopConstants as constant}
    <div class="listItem"><StoreConstant bopModules={bopModules} constant={constant}/></div>
  {/each}

  <!-- {#if addingConst}
    <span class="typeSelect"><TypeSelect bind:currentType={selectedType} bind:currentSubtype={selectedSubtype}/></span>
    <input class="newConstName" bind:value={newConstName}  type="text" placeholder="New Constant Name" />
    {#if selectedType === "object"}
      <div class="editionContainer"><ObjectDefinitionMiniApp initialData={{}} format={{}} bind:this={MiniApp}/></div>
    {:else if selectedType === "array" && selectedSubtype !== undefined}
      <div class="editionContainer"><ArrayDefinitionEditor bind:definitionData={arrayData}/></div>
    {:else}
      <div class="editionContainer"><EditingField editingType={selectedType} subtype={selectedSubtype} bind:propValue={selectedValue}/></div>
    {/if}
    <div class="confirmButton" on:click={confirmNewConst}><div class="addIcon">CONFIRM</div></div>
  {:else}
    <div class="list">
      {#each $bopConstants as constant}
        <div class="listItem"><StoreConstant bopModules={bopModules} constant={constant}/></div>
      {/each}
    </div>
    <div class="addButton" on:click={startAddingConst}><div class="addIcon"><DropdownIcon/></div></div>
  {/if} -->
</div>

<svelte:window on:keydown={(e) => { if(e.key === "Escape") addingConst = false; } } />
<style lang="scss">
  .confirmButton {
    padding: 10px;
    text-align: center;
    background-color: azure;
  }

  .constantStore {
    position: relative;
    height: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
    width: 100%;
  }

  .list {
    display: flex;
    max-width: 100%;
    flex-direction: column;
    align-items: center;
  }

  .newConstName {
    display: inline-block;
    width: 80%;
    height: 28px;
    margin-bottom: 4px;
  }

  .typeSelect {
    height: 32px;
    margin-right: 10px;
    display: inline-flex;
  }

  .editionContainer {
    background-color: rgba(100, 100, 150, 0.116);
    height: calc(85% - 32px);
    margin-left: 2px;
    margin-right: 2px;
    width: calc(100%  - 4px);
    top: 0;
    margin-bottom: 3px;
    z-index: 1;
    overflow-y: scroll;
  }

  .confirmButton {
    text-align: center;
    bottom: 2px;
    height: 15;
    background-color: aqua;
    width: 100%;
  }

  .addButton {
    position: absolute;
    width: 90%;
    height: 8%;
    bottom: 8px;
    left: 5%;
    display: flex;
    justify-self: center;
    border-radius: 6px;
    background-color: #515151;
    justify-content: center;
    outline: dashed gray 3px;
  }

  .addButton:hover {
    background-color: rgb(102, 102, 102);
  }

  .addIcon {
    stroke: whitesmoke;
    height: 10%;
    width: 10%;
    margin-top: 2%;
  }
</style>