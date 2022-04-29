<script lang="ts">
import type { ObjectDefinition } from "@meta-system/object-definition";
import { createEventDispatcher } from "svelte";
import { EditorLevel, EditorLevels } from "../../object-definition/obj-def-editor-types-and-helpers";
import ObjectDefinitionMiniApp from "../../object-definition/object-definition-mini-app.svelte";

export let protocolData : object = {};
export let protocolDefinition : ObjectDefinition;

let editorReference : ObjectDefinitionMiniApp;
let titles = [];

const dispatch = createEventDispatcher();

const sendResult = () : void => {
  const result = editorReference.getDefinitionAndData()["data"]["root"];

  dispatch("confirmed", { result });
};


</script>

<div class="editor-container">
  <div class="title" >
    {#if titles.length !== 0}
      <div class="back" on:click="{() => {editorReference.navigateBackToLevel(titles.length - 1); }}"> « </div>
    {/if}
    {#each titles as title, index}
      <div class="title-bc"
        on:click="{() => { editorReference.navigateBackToLevel(index + 1); }}"
      > {title} <span> » </span></div>
      
    {/each}
  </div>
  <div class="app-container">
    <ObjectDefinitionMiniApp
    bind:this={editorReference}
    on:navigation-event={(data) => {titles = data.detail.namePaths;}}
    editingLevel={new EditorLevel(EditorLevels.signDefinition)}
    initialData={protocolData}
    initialDefinition={protocolDefinition}
    />
  </div>
  <div class="submit-cancel">
    <div class="confirm"
      on:click={sendResult}
    >
      Confirm Changes
    </div>
  </div>
</div>

<style lang="scss">
  .editor-container {
    margin-left: 22px;
    width: 450px;
    border-radius: 12px;
    background-color: #202031;
    overflow: hidden;
  }

  .title {
    position: relative;
    background-color: #0e0e16;
    font-size: 24px;
    font-family: 'comfortaa';
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    height: 40px;
    padding: 6px 12px;

    .back {
      cursor: pointer;
      position: absolute;
      left: 18px;
    }

    .title-bc {
      cursor: pointer;
      transition: 150ms;

      &:hover {
        text-shadow: 0 0 8px white;
      }
    }
  }

  .confirm {
    width: auto;
    text-align: center;
    cursor: pointer;
    border-radius: 6px;
    padding: 4px 6px;
    color: #3ae989;
    font-weight: 600;
    transition: 150ms;

    &:hover {
      text-shadow: 0 0 8px #3ae989;
    }
  }

  .app-container {
    padding: 8px;
  }

  .submit-cancel {
    background-color: #171723;
    font-size: 20px;
    
    padding: 6px 12px;
  }
</style>