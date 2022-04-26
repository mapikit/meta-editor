<script lang="ts">
  import InputSection from "./input-section.svelte";
  import OutputSection from "./output-section.svelte";
  import { bopStore } from "../../../stores/bop-store";
  import type { ModuleCard } from "../../../common/types/module-card";
  import { functionsInfo } from "../helpers/functions-info";
  import StaticCardBody from "./module-card-skeleton.svelte";
  import { getAvailableKey } from "../helpers/get-available-key";
  import { scale as zoomIn, fly } from "svelte/transition";
  import { environment } from "../../../stores/environment";

  export let moduleConfig : ModuleCard;
  moduleConfig.key = moduleConfig.key ?? getAvailableKey($bopStore.configuration);
  moduleConfig.dependencies = moduleConfig.dependencies ?? [];
  moduleConfig.position = moduleConfig.position ?? { x: 220*$environment.distributionColumn++, y: 70 };
  //Maybe create a "smartPosition" function that considers the "distance" (module steps) from output
  // And [modular] dependency numbers to position modules in a grid-like organization when
  // the modules position is not present (BOP was imported)
  moduleConfig.info = moduleConfig.info ?? functionsInfo[moduleConfig.moduleType].get(moduleConfig.moduleName);
  export let trashPosition : DOMRect;
  let moving = false;
  let ref : HTMLDivElement;

  function startMovement (event : MouseEvent) {
    ref.style.zIndex = "1";
    ref.style.opacity = "0.5";
    moving = event.button === 0;
  }
  
  function stopMovement (event : MouseEvent) {
    if(moving && checkRectCollision(event.pageX, event.pageY, trashPosition)) {
      return deleteThis();
    }
    ref.style.opacity = "1";
    ref.style.zIndex = "0";
    moving = false;
  }

  function moveCard (event : MouseEvent) {
    if(moving) {
      moduleConfig.position.x += event.movementX/$environment.scale;
      moduleConfig.position.y += event.movementY/$environment.scale;
      bopStore.update(bop => bop);
    }
  }

  function checkRectCollision (mouseX : number, mouseY : number, targetRect : DOMRect) {
    return (mouseX > targetRect.x && mouseX < targetRect.x + targetRect.width) &&
      (mouseY > targetRect.y && mouseY < targetRect.y + targetRect.height);
  }

  function deleteThis () {
    bopStore.update(bop => {
      // Remove Dependants
      bop.configuration.forEach(module => {
        for(let i = module.dependencies.length-1; i >= 0; i--) {
          if(module.dependencies[i].origin === moduleConfig.key)
          {module.dependencies.splice(i, 1);}
        }
      });

      const index = bop.configuration.findIndex(module => module.key === moduleConfig.key);
      bop.configuration.splice(index, 1);
      return bop;
    });
  }
</script>

<style lang="scss">
  .module {
    transition: none;
    transition: opacity 260ms ease-in-out;
    transform-origin: center;
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
  in:zoomIn={{ opacity:1, start: 0.55 }}
  out:fly={{ x: 120/$environment.scale }}
  bind:this={ref}
  on:mousedown={startMovement}
  class="module" 
  style="left: {moduleConfig.position.x*$environment.scale}px; top: {moduleConfig.position.y*$environment.scale}px; transform: scale({$environment.scale});"
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


