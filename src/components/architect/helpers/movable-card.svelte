<script lang="ts">
import type { BopsConfigurationEntry }
  from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { createEventDispatcher } from "svelte";

import type { Writable } from "svelte/store";
import { AdvancedMath } from "../../../common/helpers/math";
import { Coordinate } from "../../../common/types/geometry";

import type { ModuleCard } from "../../../common/types/module-card";
import type { UIInput } from "../../../common/types/ui-input";
import { environment } from "../../../stores/environment";


export let moduleConfig : ModuleCard | UIInput;
export let bopModules : Writable<BopsConfigurationEntry[]>;

let ref : HTMLDivElement;
export let moving = false;
let movingPos = {
  origin : undefined,
  delta : undefined,
};

const dispatch = createEventDispatcher<{ movementStopped : MouseEvent }>();

function startMovement (event : MouseEvent) : void {
  if(event.button !== 0) return;

  movingPos.origin = new Coordinate(moduleConfig.position.x, moduleConfig.position.y);
  movingPos.delta = new Coordinate(0, 0);
  ref.style.zIndex = "1";
  ref.style.opacity = "0.5";
  moving = true;
}

function stopMovement (event : MouseEvent) : void {
  if(moving) {
    ref.style.opacity = "1";
    ref.style.zIndex = "0";
    moving = false;
    dispatch("movementStopped", event);
  }
}

function moveCard (event : MouseEvent) : void {
  if(moving) {
    movingPos.delta.moveBy(event.movementX/$environment.scale, event.movementY/$environment.scale);
    let newX =  movingPos.origin.x + movingPos.delta.x;
    let newY =  movingPos.origin.y + movingPos.delta.y;
    if(event.shiftKey) {
      newX = AdvancedMath.round(newX, 50);
      newY = AdvancedMath.round(newY, 50);
    }
    moduleConfig.position = moduleConfig.position.moveTo(newX, newY);
    bopModules.update(modules => modules);
  }
}



</script>

<div class="card" bind:this={ref} on:mousedown={startMovement}
style="
  left: {(moduleConfig.position.x + $environment.origin.x)*$environment.scale}px; 
  top: {(moduleConfig.position.y + $environment.origin.y)*$environment.scale}px; 
  transform: scale({$environment.scale});
  transform-origin: {$environment.origin.x}px {$environment.origin.y}px;"
>
  <slot/>
</div>
<svelte:window on:mousemove={moveCard} on:mouseup={stopMovement}/>

<style lang="scss">
  .card {
    position: absolute;
    user-select: none;
    transition: opacity 260ms ease-in-out;
  }
</style>
