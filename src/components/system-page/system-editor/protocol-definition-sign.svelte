<script lang="ts">
import type { ObjectDefinition } from "@meta-system/object-definition";
import { createEventDispatcher } from "svelte";
import { EditorLevel, EditorLevels } from "../../object-definition/obj-def-editor-types-and-helpers";
import ObjectDefinitionMiniApp from "../../object-definition/object-definition-mini-app.svelte";

export let protocolData : object = {};
export let protocolDefinition : ObjectDefinition;

let editorReference : ObjectDefinitionMiniApp;
let titles = [];
let titlesLimits = [];

const dispatch = createEventDispatcher();

const sendResult = () : void => {
  const result = editorReference.getDefinitionAndData()["data"]["root"];

  dispatch("confirmed", { result });
};

$: titlesLimits = (titles.length > 3 ? [titles[0], ...titles.slice(-2)] : titles);

</script>

<div class="editor-container">
  <div class="tools">
    <div class="action-button" on:click="{async () => {
      const data = editorReference.getDefinitionAndData()["data"]["root"];
      await navigator.clipboard.writeText(JSON.stringify(data));
    }}">
      <p class="centered"> copy data </p>
    </div>
    <div class="action-button" on:click="{async () => {
      const data = JSON.parse(await navigator.clipboard.readText());
      protocolData = data;
    }}">
      <p class="centered"> paste data </p>
    </div>
  </div>
  <div class="title" >
    {#if titles.length !== 0}
      <div class="back" on:click="{() => {editorReference.navigateBackToLevel(titles.length - 1); }}"> {"<"} </div>
    {/if}
    {#if titles.length < 3}
      {#each titlesLimits as title}
        <div class="title-bc"
          on:click="{() => { editorReference.navigateBackToLevel(title.index + 1); }}"
        > {title.name} <span> {">"} </span></div>
      {/each}
    {:else}
      <div class="title-bc"
        on:click="{() => { editorReference.navigateBackToLevel(titlesLimits[0].index + 1); }}"
      > {titlesLimits[0].name} <span> {">"} </span></div>
      <div class="title-bc ellipsis"> (...) </div>
      <div class="title-bc"
        on:click="{() => { editorReference.navigateBackToLevel(titlesLimits[titlesLimits.length-2].index + 1); }}"
      > {titlesLimits[titlesLimits.length-2].name} <span> {">"} </span></div>
      <div class="title-bc"
        on:click="{() => { editorReference.navigateBackToLevel(titlesLimits[titlesLimits.length-1].index + 1); }}"
      > {titlesLimits[titlesLimits.length-1].name} <span> {">"} </span></div>
    {/if}
  </div>
  <div class="app-container">
    <ObjectDefinitionMiniApp
    bind:this={editorReference}
    on:navigation-event={(data) => {titles = data.detail.namePaths.map((name, index) => ({ name, index }));}}
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
  .tools {
    background-color: #0e0e16;
    border-bottom: solid 1px #3ae989;
    padding: 6px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-evenly;

    &>.action-button {
      border-radius: 8px;
      background-color: #202031;
      font-size: 18px;
      padding: 8px 22px;
      text-align: center;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &:hover {
        background-color: #2d2d41;
      }
    }
  }

  .editor-container {
    position: relative;
    margin-left: 22px;
    width: 450px;
    border-radius: 12px;
    background-color: #202031;
    overflow: hidden;
  }

  .title {
    position: relative;
    background-color: #0e0e16;
    font-size: 18px;
    font-family: 'comfortaa';
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    height: 48px;
    padding: 6px 12px 6px 48px;

    &>* {
      white-space: nowrap;
    }

    .back {
      cursor: pointer;
      position: absolute;
      left: 18px;
    }

    .title-bc {
      cursor: pointer;
      margin-right: 4px;
      transition: 150ms;

      span {
        color: #3ae989;
      }

      &.ellipsis {
        color: #5f5f7c;

        &:hover {
          text-shadow: none;
          cursor: default;
        }
      }

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