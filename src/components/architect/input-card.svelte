<script lang="ts">
  import type { ObjectDefinition } from "@meta-system/object-definition";
import type { BopsConfigurationEntry } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import { get, Writable } from "svelte/store";

  import { Coordinate } from "../../common/types/geometry";
import type { ModuleCard } from "../../common/types/module-card";
  import type { UIInput } from "../../common/types/ui-input";
  import type { UIBusinessOperation } from "../../entities/business-operation";
  import { navigation } from "../../lib/navigation";
  import { businessOperations } from "../../stores/configuration-store";
  import { EditorLevel, EditorLevels } from "../object-definition/obj-def-editor-types-and-helpers";
  import ObjectDefinitionMiniApp from "../object-definition/object-definition-mini-app.svelte";
  import MovableCard from "./helpers/movable-card.svelte";
  import OutputSection from "./module-cards/output-section.svelte";

  let currentBop : UIBusinessOperation = $businessOperations.find(bop => get(bop.id) === get(navigation.currentPathParams).bopId);


  export let configuration : Writable<UIInput>;
  export let bopModules : Writable<ModuleCard[]>;
  // TODO receive Input store instead of ... whatever this is.

  let paths = [];
  let getPathsNames : () => string[];
  let navigateBackToLevel : (index : number) => void;
  let getDefinitionAndData : () => { definition: ObjectDefinition, data : object };
  let editing = false;
  const nobMapping = {};


  function startEditing () : void {
    currentBop.configuration.update(configs => {
      configs.forEach(config => {
        config.dependencies.forEach(dependency => {
          if(["input", "inputs"].includes(String(dependency.origin))) {
            dependency.originNob = undefined;
          }
        })
      })
      return configs;
    })

    editing = true;
  }

  // eslint-disable-next-line max-lines-per-function
  function finishEdition() {
    editing = false;

    // TODO make this a "await mount" style
    setTimeout(() => {
      configuration.update(input => {
        navigateBackToLevel(0);
        input.definition = getDefinitionAndData().definition["root"]["subtype"] as ObjectDefinition;

        // TODO Reimplement dependency re-routing (bellow)
        // for(const config of get(bop.configuration)) {
        //   config.dependencies.forEach((dependency, index) => {
        //     const originName = dependency.originPath.split(".")[1];
        //     if(Object.keys(nobMapping).includes(originName)) dependency.originNob = nobMapping[originName];
        //     else config.dependencies.splice(index, 1);
        //   });
        // }

        return input;
      })
    }, 200);
  }

</script>

<MovableCard moduleConfig={$configuration} bopModules={bopModules}>
  <div slot="content">
    {#if !editing}
      <div class="inputModule">
        <div class="header">Input  <button on:click={startEditing}>Edit</button></div>
        {#each Object.keys($configuration.definition) as key}
          <OutputSection info={$configuration.definition[key]} bopModules={bopModules} name={key} parentKey={"input"} bind:nob={nobMapping[key]}/>
        {/each}
      </div>
    {:else}
      <div class="inputDefinition">
        <span on:click={() => navigateBackToLevel(0)} class="clickablePath">Input</span>
        {#each paths as path, index}
          &gt <span class="clickablePath" on:click={() => navigateBackToLevel(index+1)}>{path}</span>
        {/each}
        <button on:click={() => finishEdition() }>Edit</button>
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
    background-color: rgb(94, 94, 94);
  }
  .inputModule {
    background-color: cornflowerblue;
    padding-bottom: 8px;
    min-width: 150px;
  }

  .inputDefinition {
    transition: width 2s ease-in-out;
    background-color: red;
    border-radius: 0 20px 20px 0;
  }

  .clickablePath {
    cursor: pointer;
    background-color: gray;
  }
</style>

