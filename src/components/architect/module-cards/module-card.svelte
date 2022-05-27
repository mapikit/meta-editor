<script lang="ts">
  import InputSection from "./input-section.svelte";
  import OutputSection from "./output-section.svelte";
  import type { ModuleCard } from "../../../common/types/module-card";
  import { functionsInfo } from "../helpers/functions-info";
  import StaticCardBody from "./module-card-skeleton.svelte";
  import { getAvailableKey } from "../helpers/get-available-key";
  import { environment } from "../../../stores/environment";
  import { Coordinate } from "../../../common/types/geometry";
  import { selectedNob } from "../../../stores/connection-stores";
  import { solveConnection } from "../helpers/solve-connection";
  import MovableCard from "../helpers/movable-card.svelte";
  import type { Writable } from "svelte/store";

  export let moduleConfig : ModuleCard;
  export let bopModules : Writable<ModuleCard[]>
  moduleConfig.key = moduleConfig.key ?? getAvailableKey($bopModules);
  moduleConfig.dependencies = moduleConfig.dependencies ?? [];
  moduleConfig.dimensions = moduleConfig.dimensions ?? { height: undefined, width: undefined };
  moduleConfig.position = moduleConfig.position ?? new Coordinate(220*$environment.distributionColumn++, 70 );
  // TODO Maybe create a "smartPosition" function that considers the "distance" (module steps) from output
  // And [modular] dependency numbers to position modules in a grid-like organization when
  // the modules position is not present (BOP was imported)
  // Also, this sort of distribuition should line in the upper level
  moduleConfig.dimensions = moduleConfig.dimensions ?? { height: undefined, width: undefined };
  moduleConfig.position = moduleConfig.position ?? new Coordinate(220*$environment.distributionColumn++, 70 );
  moduleConfig.info = moduleConfig.info ?? functionsInfo[moduleConfig.moduleType].get(moduleConfig.moduleName);

  export let trashPosition : DOMRect;
  let moduleNob : HTMLSpanElement;

  function checkRectCollision(x : number, y : number, targetRect : DOMRect) : boolean {
    return (x > targetRect.x && x < targetRect.x + targetRect.width) &&
      (y > targetRect.y && y < targetRect.y + targetRect.height);
  }

  function checkDeletion (event : MouseEvent) : void {
    if(checkRectCollision(event.x, event.y, trashPosition)) deleteCard()
  }

  function deleteCard () {
    bopModules.update(modules => {
      // Remove Dependants
      modules.forEach(module => {
        for(let i = module.dependencies.length-1; i >= 0; i--) {
          if(module.dependencies[i].origin === moduleConfig.key)
          {module.dependencies.splice(i, 1);}
        }
      });

      const index = $bopModules.findIndex(module => module.key === moduleConfig.key);
      modules.splice(index, 1);

      return modules;
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
    }, bopModules)})
  }
</script>


<MovableCard moduleConfig={moduleConfig} stopMovementCallback={checkDeletion} bopModules={bopModules}>
  <StaticCardBody definition={moduleConfig.info} tooltipPosition="top" slot="content">
    <span slot="moduleNob" class="moduleNob" bind:this={moduleNob} on:click={moduleConnect}>M</span>
    <div slot="content" class="IODiv">
      <div class="inputs">
        {#each Object.keys(moduleConfig.info.input) as key}
          <InputSection bind:bopModules name={key} parentKey={moduleConfig.key} info={moduleConfig.info.input[key]}/>
        {/each}
      </div>
      <div class="outputs">
        {#each Object.keys(moduleConfig.info.output) as key}
          <OutputSection bind:bopModules name={key} parentKey={moduleConfig.key} info={moduleConfig.info.output[key]}/>
        {/each}
      </div>
    </div>
  </StaticCardBody>
</MovableCard>






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
