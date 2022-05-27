<script lang="ts">
  import type { ObjectDefinition } from "@meta-system/object-definition";
  import type { Writable } from "svelte/store";


  import { Coordinate } from "../../common/types/geometry";
  import type { ModuleCard } from "../../common/types/module-card";
  import { EditorLevel, EditorLevels } from "../object-definition/obj-def-editor-types-and-helpers";
  import ObjectDefinitionMiniApp from "../object-definition/object-definition-mini-app.svelte";
  import { getAvailableKey } from "./helpers/get-available-key";
  import MovableCard from "./helpers/movable-card.svelte";
  import InputSection from "./module-cards/input-section.svelte";


  export let configuration : Writable<ObjectDefinition>;
  export let bopModules : Writable<ModuleCard[]>;

  let module = $bopModules.find((module) => module.moduleType === "output")
  if (module === undefined) {
    module = {
      dependencies: [],
      moduleType: "output",
      key: getAvailableKey($bopModules),
      moduleName: "output",
      position: new Coordinate(200, 200),
      info: { input: $configuration, output: undefined, functionName: "Output" }
    };
    bopModules.update(modules => {
      modules.push(module);
      return modules;
    })
  }

  module.dimensions = module.dimensions ?? { height: undefined, width: undefined };
  module.position = module.position ?? new Coordinate(200, 200);


  let paths = [];
  let getPathsNames : () => string[];
  let navigateBackToLevel : (index : number) => void
  let getDefinitionAndData : () => { definition: ObjectDefinition, data : object }
  let editing = false;

  function finishEdition() {
    navigateBackToLevel(0);
    const updatedConfig = getDefinitionAndData().definition["root"]["subtype"] as ObjectDefinition;
    configuration.set(updatedConfig);
    editing = false;
  }
</script>

<MovableCard moduleConfig={module} bopModules={bopModules}>
  <div slot="content">
    {#if !editing}
      <div class="inputModule">
        <div class="header">Output  <button on:click={() => editing=!editing }>Edit</button></div>
        {#each Object.keys($configuration) as key}
          <InputSection info={$configuration[key]} name={key} parentKey={module.key} bind:bopModules/>
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
          initialDefinition={$configuration} initialData={{}}
          on:navigation-event={() => { paths = getPathsNames() }}
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

