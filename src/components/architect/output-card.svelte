<script lang="ts">
import type { ObjectDefinition } from "@meta-system/object-definition";


  import { Coordinate } from "../../common/types/geometry";
  import { bopStore } from "../../stores/bop-store";
  import { EditorLevel, EditorLevels } from "../object-definition/obj-def-editor-types-and-helpers";
  import ObjectDefinitionMiniApp from "../object-definition/object-definition-mini-app.svelte";
  import { getAvailableKey } from "./helpers/get-available-key";
  import MovableCard from "./helpers/movable-card.svelte";
  import InputSection from "./module-cards/input-section.svelte";

  console.log("Starting Output Build")

  export let configuration : ObjectDefinition;
  let module = $bopStore.configuration.find((module) => module.moduleType === "output")
  console.log(module)
  if (module === undefined) module = {
    dependencies: [],
    moduleType: "output",
    key: getAvailableKey($bopStore.configuration),
    moduleName: "output",
    position: new Coordinate(200, 200),
    info: { input: configuration, output: undefined, functionName: "Output" },
  }

  module.dimensions = module.dimensions ?? { height: undefined, width: undefined };
  module.position = module.position ?? new Coordinate(200, 200);


  let paths = [];
  let getPathsNames : () => string[];
  let navigateBackToLevel : (index : number) => void
  let getDefinitionAndData : () => { definition: ObjectDefinition, data : object }
  let editing = false;

  function finishEdition() {
    bopStore.update(bop => {
      navigateBackToLevel(0)
      configuration = getDefinitionAndData().definition["root"]["subtype"] as ObjectDefinition;
      bop.output = configuration
      return bop;
    })
    
    editing = false;
  }
</script>

<MovableCard moduleConfig={module}>
  <div slot="content">
    {#if !editing}
      <div class="inputModule">
        <div class="header">Output  <button on:click={() => editing=!editing }>Edit</button></div>
        {#each Object.keys(configuration) as key}
          <InputSection info={configuration[key]} name={key} parentKey={module.key}/>
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
          initialDefinition={configuration} initialData={{}}
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

