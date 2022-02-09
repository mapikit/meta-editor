<script lang="ts">
  import InputSection from "./input-section.svelte";
  import OutputSection from "./output-section.svelte";
  import { bopStore } from "../../../stores/bop-store";
  import type { ModuleCard } from "../../../common/types/module-card";
  import { functionsInfo } from "../helpers/functions-info";
  import { getFullName } from "../../../common/helpers/get-full-name";
  import { moduleConnections } from "../../../stores/connection-stores";
  import { getConnectionIdentifier } from "../helpers/get-connection-identifier";
  import StaticCardBody from "./module-card-skeleton.svelte";
  import { getAvailableKey } from "../helpers/get-available-key";
  import { scale, fly } from "svelte/transition";

  export let moduleConfig : ModuleCard;
  moduleConfig.key = moduleConfig.key ?? getAvailableKey($bopStore.configuration);
  moduleConfig.dependencies = moduleConfig.dependencies ?? [];
  moduleConfig.position = moduleConfig.position ?? { x: 70, y: 70 };
  moduleConfig.info = moduleConfig.info ?? functionsInfo[moduleConfig.moduleType].get(moduleConfig.moduleName);
  export let trashPosition : DOMRect;
  let moving = false;
  let ref : HTMLDivElement;

  function startMovement (event : MouseEvent) {
    ref.style.zIndex = "1";
    moving = event.button === 0 }
  function stopMovement (event : MouseEvent) { 
    if(moving && checkRectCollision(event.pageX, event.pageY, trashPosition)) {
      deleteThis();
    }
    ref.style.zIndex = "0"
    moving = false 
  }

  function moveCard (event : MouseEvent) {
    if(moving) {
      moduleConfig.position.x += event.movementX
      moduleConfig.position.y += event.movementY
      bopStore.update(bop => bop);
    }
  }

  function checkRectCollision(mouseX : number, mouseY : number, targetRect : DOMRect) {
    return (mouseX > targetRect.x && mouseX < targetRect.x + targetRect.width) &&
      (mouseY > targetRect.y && mouseY < targetRect.y + targetRect.height);
  }

  function deleteThis () {
    bopStore.update(bop => {
    const index = bop.configuration.findIndex(module => module.key === moduleConfig.key);
    const dependencies = bop.configuration[index].dependencies;
    // Delete inbound connections
    for(const dependency of dependencies) {
      const identifier = getConnectionIdentifier(dependency, moduleConfig.key);
      delete moduleConnections[identifier];
    }
    // Delete outbound connections
    for(const module of bop.configuration) {
      for(const dependency in module.dependencies) {
        if(module.dependencies[dependency].origin === moduleConfig.key) {
          const identifier = getConnectionIdentifier(module.dependencies[dependency], module.key);
          
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
    user-select: none;
    min-width: 120px;
    user-select: none;
    cursor: default;
    position: absolute;
  }

  .IODiv {
    display: grid;
    position: relative;
    align-items: center;
  }
  
  .inputs {
    grid-column: 1;
    padding-right: 6px;
  }

  // .divider {
  //   position: absolute;
  //   width: 2px;
  //   height: 80%;
  //   left: calc(50% - 1px);
  //   top: 10%;
  //   background-color: #222222;
  // }
  
  .outputs {
    grid-column: 2;
    padding-left: 6px;
  }
</style>

<div 
  in:scale={{opacity:1, start: 0.55}}
  out:fly={{x: 100}}
  bind:this={ref}
  on:mousedown={startMovement}
  class="module" 
  style="left: {moduleConfig.position.x}px; top: {moduleConfig.position.y}px"
>
  <StaticCardBody definition={moduleConfig.info}>
    <div slot="content" class="IODiv">
      <div class="inputs">
        {#each Object.keys(moduleConfig.info.input) as key}
          <InputSection  name={key} parentInfo={moduleConfig}/>
        {/each}
      </div>
      <div class="outputs">
        {#each Object.keys(moduleConfig.info.output) as key}
          <OutputSection  name={key} parentInfo={moduleConfig}/>
        {/each}
      </div>
    </div>
  </StaticCardBody>
</div>


<svelte:window on:mousemove={moveCard} on:mouseup={stopMovement}/>


