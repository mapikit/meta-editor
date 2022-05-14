<script lang="ts">
  import { isObjectDefinition, ObjectDefinition } from "@meta-system/object-definition";

  import { Coordinate } from "../../common/types/geometry";
  import type { UIInput } from "../../common/types/ui-input";
  import { bopStore } from "../../stores/bop-store";
  import { EditorLevel, EditorLevels } from "../object-definition/obj-def-editor-types-and-helpers";
  import ObjectDefinitionMiniApp from "../object-definition/object-definition-mini-app.svelte";
  import MovableCard from "./helpers/movable-card.svelte";
  import OutputSection from "./module-cards/output-section.svelte";

  export let configuration : UIInput | ObjectDefinition;
  const uiConfiguration : UIInput = { definition: undefined };
  try { 
    isObjectDefinition(configuration); 
    uiConfiguration.definition = configuration;
  }
  catch (err) { Object.assign(uiConfiguration, configuration); }
  finally { if (uiConfiguration.position === undefined) uiConfiguration.position = new Coordinate(-100, 100); }

  let paths = [];
  let getPathsNames : () => string[];
  let navigateBackToLevel : (index : number) => void;
  let getDefinitionAndData : () => { definition: ObjectDefinition, data : object };
  let editing = false;
  const nobMapping = {};


  function startEditing () : void {
    bopStore.update(bop => {
      bop.configuration.forEach(config => {
        config.dependencies.forEach(dependency => {
          if(["input", "inputs"].includes(String(dependency.origin))) {
            dependency.originNob = undefined;
          }
        });
      });
      return bop;
    });

    editing = true;
  }

  // eslint-disable-next-line max-lines-per-function
  function finishEdition() {
    editing = false;

    // TODO make this a "await mount" style
    setTimeout(() => {
      bopStore.update(bop => {
        navigateBackToLevel(0);
        uiConfiguration.definition = getDefinitionAndData().definition["root"]["subtype"] as ObjectDefinition;
        bop.input = uiConfiguration;

        for(const config of bop.configuration) {
          config.dependencies.forEach((dependency, index) => {
            const originName = dependency.originPath.split(".")[1];
            if(Object.keys(nobMapping).includes(originName)) dependency.originNob = nobMapping[originName];
            else config.dependencies.splice(index, 1);
          });
        }
        return bop;
      });
    }, 200);
  }

</script>

<MovableCard moduleConfig={uiConfiguration}>
  <div slot="content">
    {#if !editing}
      <div class="inputModule">
        <div class="header">Input  <button on:click={startEditing}>Edit</button></div>
        {#each Object.keys(uiConfiguration.definition) as key}
          <OutputSection info={uiConfiguration.definition[key]} name={key} parentKey={"input"} bind:nob={nobMapping[key]}/>
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
          initialDefinition={uiConfiguration.definition} initialData={{}}
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

