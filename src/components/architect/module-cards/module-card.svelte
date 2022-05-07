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
  import { Coordinate } from "../../../common/types/geometry";
  import { selectedNob } from "../../../stores/connection-stores";
  import { solveConnection } from "../helpers/solve-connection";

  export let moduleConfig : ModuleCard;
  moduleConfig.key = moduleConfig.key ?? getAvailableKey($bopStore.configuration);
  moduleConfig.dependencies = moduleConfig.dependencies ?? [];
  moduleConfig.dimensions = moduleConfig.dimensions ?? { height: undefined, width: undefined };
  moduleConfig.position = moduleConfig.position ?? new Coordinate(220*$environment.distributionColumn++, 70 );
  //Maybe create a "smartPosition" function that considers the "distance" (module steps) from output
  // And [modular] dependency numbers to position modules in a grid-like organization when
  // the modules position is not present (BOP was imported)
  // Also, this sort of distribuition should line in the upper level
  moduleConfig.info = moduleConfig.info ?? functionsInfo[moduleConfig.moduleType].get(moduleConfig.moduleName);
  export let trashPosition : DOMRect;
  let moving = false;
  let ref : HTMLDivElement;
  let moduleNob : HTMLSpanElement;

  function startMovement (event : MouseEvent) {
    if(event.button !== 0) return;

    ref.style.zIndex = "1";
    ref.style.opacity = "0.5";
    moving = true
  }
  
  function stopMovement (event : MouseEvent) {
    if(moving && checkRectCollision(event.pageX, event.pageY, trashPosition)) {
      return deleteCard();
    }
    ref.style.opacity = "1";
    ref.style.zIndex = "0";
    moving = false;
  }

  function moveCard (event : MouseEvent) {
    if(moving) {
      moduleConfig.position.moveBy(event.movementX/$environment.scale, event.movementY/$environment.scale);
      bopStore.update(bop => bop);
    }
  }

  function checkRectCollision (mouseX : number, mouseY : number, targetRect : DOMRect) {
    return (mouseX > targetRect.x && mouseX < targetRect.x + targetRect.width) &&
      (mouseY > targetRect.y && mouseY < targetRect.y + targetRect.height);
  }

  function deleteCard () {
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

  function moduleConnect () {
    selectedNob.update((current) => {
      return solveConnection(current, {
      parentKey: moduleConfig.key,
      nob: moduleNob,
      property: undefined,
      nobType: "module",
      propertyType: "function"
    })})
  }
</script>

<div 
  in:zoomIn={{opacity:1, start: 0.55}}
  out:fly={{x: 120/$environment.scale}}
  bind:this={ref}
  bind:clientWidth={moduleConfig.dimensions.width}
  bind:clientHeight={moduleConfig.dimensions.height}
  on:mousedown={startMovement}
  class="module" 
  style="
    left: {(moduleConfig.position.x + $environment.origin.x)*$environment.scale}px; 
    top: {(moduleConfig.position.y + $environment.origin.y)*$environment.scale}px; 
    transform: scale({$environment.scale});
    transform-origin: {$environment.origin.x}px {$environment.origin.y}px;"
>
  <StaticCardBody definition={moduleConfig.info} tooltipPosition="top">
    <span slot="moduleNob" class="moduleNob" bind:this={moduleNob} on:click={moduleConnect}>M</span>
    <div slot="content" class="IODiv">
      <div class="inputs">
        {#each Object.keys(moduleConfig.info.input) as key}
          <InputSection  name={key} parentKey={moduleConfig.key} info={moduleConfig.info.input[key]}/>
        {/each}
      </div>
      <div class="outputs">
        {#each Object.keys(moduleConfig.info.output) as key}
          <OutputSection  name={key} parentKey={moduleConfig.key} info={moduleConfig.info.output[key]}/>
        {/each}
      </div>
    </div>
  </StaticCardBody>
</div>


<svelte:window on:mousemove={moveCard} on:mouseup={stopMovement}/>

<style lang="scss">
  .module {
    transition: none;
    transition: opacity 260ms ease-in-out;
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

  .moduleNob {
    position: absolute;
    padding-left: 7px;
    padding-right: 5px;
    border-radius: 0 7px 7px 0;
    left: calc(100% - 5px);
    background-color: rgb(68, 68, 68);
    z-index: -1;
  }
  .moduleNob:hover {
    background-color: rgb(92, 92, 92);;
  }
  
  .outputs {
    grid-column: 2;
    padding-left: 6px;
  }
</style>
