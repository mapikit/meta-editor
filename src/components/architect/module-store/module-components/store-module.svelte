<script lang="ts">
  import type { FunctionDefinition } from "@meta-system/meta-function-helper";
  import { getAvailableKey } from "../../helpers/get-available-key";
  import { bopStore } from "../../../../stores/bop-store";
  import ModuleCardSkeleton from "../../module-cards/module-card-skeleton.svelte";
  import StoreInput from "./store-input.svelte";
  import StoreOutput from "./store-output.svelte";
  import { environment } from "../../../../stores/environment";
  import type { ModuleType } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import { Coordinate } from "../../../../common/types/geometry";


  export let definition : FunctionDefinition;
  export let moduleType : ModuleType;
  export let storeLocked = false;

  let moving = false;
  let ref : HTMLDivElement;
  let newCard : HTMLDivElement;
  let left = 0;
  let top = 0;

  function startMovement (event : MouseEvent) {
    storeLocked = true;
    moving = event.button === 0;
    let currentParent = document.getElementById("architect");
    newCard = currentParent.appendChild(ref.cloneNode(true)) as HTMLDivElement;
    newCard.style.position = "absolute";
    newCard.style.width = `${ref.getBoundingClientRect().width}px`;
    const currentPos = ref.getBoundingClientRect();
    const parentOffset = currentParent.getBoundingClientRect()
    top = currentPos.y-parentOffset.y;
    left = currentPos.x-parentOffset.x;
    newCard.style.left = `${left}px`;
    newCard.style.top = `${top}px`;
    ref.style.visibility = "hidden"

  }

  function stopMovement (event : MouseEvent) {
    moving = false;
    storeLocked = false;
    const storeRect = ref.closest("#store").getBoundingClientRect();
    if(newCard !== undefined) {
      if(event.x < storeRect.x) {
        bopStore.update(bop => {
          bop.configuration.push({
            dependencies: [],
            key: getAvailableKey(bop.configuration),
            moduleName: definition.functionName,
            moduleType: moduleType,
            info: definition,
            position: new Coordinate(left, top)
              .moveBy(-$environment.origin.x, -$environment.origin.y)
              .scale(1/$environment.scale),
            modulePackage: undefined, // TODO Figure this out as well
          })
          return bop;
        }) 
      }
      
      newCard.remove()
      newCard = undefined;
      ref.style.visibility = "visible";
    }
    left = top = 0;
  }

  function moveCard (event : MouseEvent) {
    if(moving) {
      left += event.movementX;
      top += event.movementY;
      newCard.style.left = `${left}px`;
      newCard.style.top = `${top}px`;
    }
  }
  
</script>


<div class="items" bind:this={ref} on:mousedown={startMovement}>
  <ModuleCardSkeleton definition={definition}>
    <div slot="content" class="IO">
      <div class="inputs">
        {#each Object.keys(definition.input) as key}
          <StoreInput  type={definition.input[key].type}/>
        {/each}
      </div>
      <div class="separator"></div>
      <div class="outputs">
        {#each Object.keys(definition.output) as key}
          <StoreOutput type={definition.output[key].type}/>
        {/each}
      </div>
    </div>
  </ModuleCardSkeleton>
</div>

<svelte:window on:mousemove={moveCard} on:mouseup={stopMovement}/>

<style lang="scss">
  .items {
    width: 90%;
    display: inline-block;
    float: none;
    position: relative;
    z-index: 2;
  }
  .IO {
    margin: 0 3px 0 3px;
    position: relative;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 1fr 1fr;
    font-size: 60%;
  }
  .inputs {
    grid-column: 1;
    grid-row: 1;
    text-align: left;
  }

  .separator {
    position: absolute;
    width: 2px;
    height: 100%;
    top: 10%;
    left: calc(50% - 1px);
    background-color: #222222;
  }

  .outputs {
    grid-column: 2;
    grid-row: 1;
    text-align: right;
  }
</style>