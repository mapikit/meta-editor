<script lang="ts">
  import InputSection from "./input-section.svelte";
  import OutputSection from "./output-section.svelte";
  import { bopStore } from "../../../stores/bop-store";
  import type { ModuleCard } from "../../../common/types/module-card";
  import { functionsInfo } from "../functions-info";
  import { getFullName } from "../../../common/helpers/get-full-name";
  import { moduleConnections } from "../../../stores/connection-stores";

  export let moduleConfig : ModuleCard;

  moduleConfig.key = moduleConfig.key ?? Math.random()*1000;
  moduleConfig.dependencies = moduleConfig.dependencies ?? [];
  moduleConfig.position = moduleConfig.position ?? { x: 70, y: 70 };
  moduleConfig.info = moduleConfig.info ?? functionsInfo.get(getFullName(moduleConfig));
  
  let moving = false;

  function startMovement (event : MouseEvent) { moving = event.button === 0 }
  function stopMovement () { moving = false }

  function moveCard (event : MouseEvent) {
    if(moving) {
      moduleConfig.position.x += event.movementX
      moduleConfig.position.y += event.movementY
      bopStore.update(bop => bop);
    }
  }

  function deleteThis () {
    bopStore.update(bop => {
      const index = bop.configuration.findIndex(module => module.key === moduleConfig.key);
      const dependencies = bop.configuration[index].dependencies;
      // Delete inbound connections
      for(const dependency of dependencies) {
        const identifier = 
          `${dependency.originPath.split(".").slice(1).join(".")}@${dependency.origin}-`+
          `${dependency.targetPath}@${moduleConfig.key}`
        delete moduleConnections[identifier];
      }
      // Delete outbound connections
      for(const module of bop.configuration) {
        console.log(module)
        for(const dependency in module.dependencies) {

          if(module.dependencies[dependency].origin === moduleConfig.key) {
            const identifier = 
              `${module.dependencies[dependency].originPath.split(".").slice(1).join(".")}@${module.dependencies[dependency].origin}-`+
              `${module.dependencies[dependency].targetPath}@${module.key}`
            
            module.dependencies.splice(Number(dependency), 1);
            delete moduleConnections[identifier];
          }
        }
      }

      bop.configuration.splice(index, 1);
      return bop;
    })
  }
</script>

<style lang="scss">
  .module {
    min-width: 120px;
    user-select: none;
    cursor: default;
    background-color: rgb(49, 44, 44);
    border-radius: 10px;
    position: absolute;
    padding: 7px 0 7px 0;
    border: solid rgba(0, 0, 0, 0.884) 1px;
  }
  .modName {
    margin: 0 15px 0 15px;
  }

  .trash {
    display: inline;
    margin-right: 7px;
  }
</style>

<div 
  on:mousedown={startMovement}
  class="module" 
  style="left: {moduleConfig.position.x}px; top: {moduleConfig.position.y}px"
>
  <span class="modName">Module: {moduleConfig.info.functionName}</span><input type="button" class="trash" on:click={deleteThis} value="T">

  {#each Object.keys(moduleConfig.info.input) as input}
    <InputSection name={input} parentInfo={moduleConfig}/>
  {/each}
  {#each Object.keys(moduleConfig.info.output) as output}
    <OutputSection name={output} parentInfo={moduleConfig}/>
  {/each}
</div>

<svelte:window on:mousemove={moveCard} on:mouseup={stopMovement}/>


