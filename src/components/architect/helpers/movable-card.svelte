<script lang="ts">
  import type { ModuleCard } from "../../../common/types/module-card";
  import type { UIInput } from "../../../common/types/ui-input";
  import { bopStore } from "../../../stores/bop-store";
  import { environment } from "../../../stores/environment";


  export let moduleConfig : ModuleCard | UIInput;
  export let stopMovementCallback : (mouseEvent : MouseEvent) => void = () => {};
  let ref : HTMLDivElement;
  let moving = false;

  function startMovement (event : MouseEvent) {
    if(event.button !== 0) return;

    ref.style.zIndex = "1";
    ref.style.opacity = "0.5";
    moving = true
  }
  
  function stopMovement (event : MouseEvent, endOfMovementCallback ?: (mouseEvent : MouseEvent) => void) {
    // if(moving && checkRectCollision(event.pageX, event.pageY, trashPosition)) {
    //   return deleteCard();
    // }
    ref.style.opacity = "1"
    ref.style.zIndex = "0"
    moving = false
    if(endOfMovementCallback) endOfMovementCallback(event);
  }

  function moveCard (event : MouseEvent) {
    if(moving) {
      moduleConfig.position = moduleConfig.position.moveBy(event.movementX/$environment.scale, event.movementY/$environment.scale);
      bopStore.update(bop => bop);
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
  <slot name="content"/>
</div>
<svelte:window on:mousemove={moveCard} on:mouseup={(event) => stopMovement(event, stopMovementCallback)}/>

<style lang="scss">
  .card {
    position: absolute;
    user-select: none;
    transition: opacity 260ms ease-in-out;
  }
</style>
