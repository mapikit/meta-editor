<script lang="ts">
  import type { ObjectDefinition } from "@meta-system/object-definition";
  import type { Writable } from "svelte/store";
  import { slide } from "svelte/transition";
  import type { ModuleCard } from "../../common/types/module-card";
  import type { UIInput } from "../../common/types/ui-input";
  import { EditorLevel, EditorLevels } from "../object-definition/obj-def-editor-types-and-helpers";
  import ObjectDefinitionMiniApp from "../object-definition/object-definition-mini-app.svelte";
  import MovableCard from "./helpers/movable-card.svelte";
  import OutputSection from "./module-cards/output-section.svelte";


  export let configuration : Writable<UIInput>;
  export let bopModules : Writable<ModuleCard[]>;

  let paths = [];
  let getPathsNames : () => string[];
  let navigateBackToLevel : (index : number) => void;
  let getDefinitionAndData : () => { definition: ObjectDefinition, data : object };
  let editing = false;


  function startEditing () : void {
    editing = true;
  }

  // eslint-disable-next-line max-lines-per-function
  function finishEdition() {
    editing = false;

    configuration.update(input => {
      navigateBackToLevel(0);
      input.definition = getDefinitionAndData().definition["root"]["subtype"] as ObjectDefinition;

      return input;
    });
  }

</script>

<MovableCard moduleConfig={$configuration} bopModules={bopModules}>
  <div slot="content">
    {#if !editing}
      <div class="inputModule" in:slide>
        <div class="header">Input  <button on:click={startEditing} class="button">Edit</button></div>
        {#each Object.keys($configuration.definition) as key}
          <OutputSection info={$configuration.definition[key]} bopModules={bopModules} name={key} parentKey={"input"}/>
        {/each}
      </div>
    {:else}
      <div class="inputDefinition" in:slide>
        <div class="header">
          <span on:click={() => navigateBackToLevel(0)} class="clickablePath">Input</span>
          <button on:click={() => finishEdition() } class="button">Edit</button>
        </div>
        {#each paths as path, index}
          &gt <span class="clickablePath" on:click={() => navigateBackToLevel(index+1)}>{path}</span>
        {/each}
        <ObjectDefinitionMiniApp
          editingLevel={new EditorLevel(EditorLevels.createDefinition)} 
          initialDefinition={$configuration.definition} initialData={{}}
          on:navigation-event={() => { paths = getPathsNames(); }}
          bind:getPathsNames
          bind:navigateBackToLevel
          bind:getDefinitionAndData
          />
      </div>      
    {/if}
  </div>
</MovableCard>



<style lang="scss">
  .header {
    border-radius: 5px 5px 0 0;
    padding: 2px 2px 0 8px;
    background-color: rgb(94, 94, 94);
    margin-bottom: 5px;
  }
  .button {
    position: absolute;
    right: 3px;
  }

  .inputModule {
    border-radius: 5px;
    background-color: #34344b;
    padding-bottom: 8px;
    min-width: 150px;
  }

  .inputDefinition {
    transition: width 2s ease-in-out;
    background-color: #34344b;
    border-radius: 5px;
  }

  .clickablePath {
    cursor: pointer;
  }
</style>

