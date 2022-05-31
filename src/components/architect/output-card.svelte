<script lang="ts">
  import type { ObjectDefinition } from "@meta-system/object-definition";
import type { BopsConstant } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import type { Writable } from "svelte/store";
  import { slide } from "svelte/transition";


  import { Coordinate } from "../../common/types/geometry";
  import type { ModuleCard } from "../../common/types/module-card";
  import { EditorLevel, EditorLevels } from "../object-definition/obj-def-editor-types-and-helpers";
  import ObjectDefinitionMiniApp from "../object-definition/object-definition-mini-app.svelte";
  import { getAvailableKey } from "./helpers/get-available-key";
  import MovableCard from "./helpers/movable-card.svelte";
  import InputSection from "./module-cards/input-section.svelte";


  export let configuration : Writable<ObjectDefinition>;
  export let bopModules : Writable<ModuleCard[]>;
  export let bopConstants : Writable<BopsConstant[]>;

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
      <div class="outputModule" in:slide>
        <div class="header">Output<button class="button" on:click={() => editing=!editing }>Edit</button></div>
        {#each Object.keys($configuration) as key}
          <InputSection info={$configuration[key]} name={key} parentKey={module.key} bind:bopModules bind:bopConstants/>
        {/each}
      </div>
    {:else}
      <div class="outputDefinition" in:slide>
        <div class="header">
          <span on:click={() => navigateBackToLevel(0)} class="clickablePath">Output</span><button class="button" on:click={() => finishEdition() }>Edit</button>
        </div>
        {#each paths as path, index}
          &gt <span class="clickablePath" on:click={() => navigateBackToLevel(index+1)}>{path}</span>
        {/each}
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
    border-radius: 5px 5px 0 0;
    padding: 2px 2px 0 8px;
    background-color: rgb(94, 94, 94);
    margin-bottom: 5px;
  }
  .button {
    position: absolute;
    right: 3px;
  }

  .outputModule {
    border-radius: 5px;
    background-color: #34344b;
    padding-bottom: 8px;
    min-width: 150px;
  }

  .outputDefinition {
    transition: width 2s ease-in-out;
    background-color: #34344b;
    border-radius: 5px;
  }

  .clickablePath {
    cursor: pointer;
  }
</style>

