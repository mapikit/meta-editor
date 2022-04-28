<script lang="ts">
import type { ObjectDefinition } from "@meta-system/object-definition";
import { EditorLevel, EditorLevels } from "../../object-definition/obj-def-editor-types-and-helpers";
import ObjectDefinitionMiniApp from "../../object-definition/object-definition-mini-app.svelte";

export let protocolData : object = {};
export let protocolDefinition : ObjectDefinition;

let editorReference : ObjectDefinitionMiniApp;
let titles = [];

</script>

<div class="editor-container">
  <div class="title" >
    <p on:click="{() => {editorReference.navigateBackToLevel(titles.length - 1); }}"> « </p>
    {#each titles as title}
      <div class="title-bc"> {title} <span> » </span></div>
      
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
    <div class="submit-cancel"> cancel </div>
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
    background-color: #0e0e16;
    font-size: 28px;
    // height: 32px;
    padding: 6px 12px;

    p {
      cursor: pointer;
    }
  }

  .app-container {
    padding: 8px;
  }

  .submit-cancel {
    background-color: #171723;
    font-size: 20px;
    // height: 32px;
    padding: 6px 12px;
  }
</style>