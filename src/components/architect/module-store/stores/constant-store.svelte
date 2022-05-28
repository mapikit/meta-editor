<script lang="ts">
import type { ObjectDefinition } from "@meta-system/object-definition";

  import type { BopsConstant } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import type { SvelteComponent } from "svelte/internal";
  import type { Writable } from "svelte/store";
import { EditorLevels } from "../../../object-definition/obj-def-editor-types-and-helpers";
  import ObjectDefinitionMiniApp from "../../../object-definition/object-definition-mini-app.svelte";
import TypeSelect from "../../../object-definition/type-select.svelte";
  import DropdownIcon from "../dropdown-icon.svelte";
  import AddConstantCard from "../module-components/add-constant-card.svelte";
  import StoreConstant from "../module-components/store-constant.svelte";

  let addingConst = false;
  let newConstName : string = "";
  let MiniApp;
  export let bopConstants : Writable<BopsConstant[]>

  function confirmNewConst () : void {
    const info = MiniApp.getDefinitionAndData();
    console.log(info);
    bopConstants.update(constants => {
      const test : BopsConstant = {
        name: newConstName,
        type: info.definition["root"],
        value: info.definition["root"]["subtype"] 
      };
      console.log(test);
      return constants;
    })
    addingConst = false;
  }

</script>

<div class="constantStore">
  {#if addingConst}
    <span class="typeSelect"><TypeSelect/></span><input class="newConstName" bind:value={newConstName}  type="text"/>
    <div class="miniAppContainer"><ObjectDefinitionMiniApp initialData={{}} initialDefinition={{}} bind:this={MiniApp}/></div>
    <div class="confirmButton" on:click={confirmNewConst}><div class="addIcon">CONFIRM</div></div>
  {:else}
    <div class="list">
      {#each $bopConstants as constant}
        <div class="listItem"><StoreConstant constant={constant}/></div>
      {/each}
    </div>
    <div class="addButton" on:click={() => { addingConst = true; }}><div class="addIcon"><DropdownIcon/></div></div>
  {/if}
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

  .miniAppContainer {
    background-color: antiquewhite;
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