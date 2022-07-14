<script lang="ts">
import type { BopsConfigurationEntry } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { createEventDispatcher } from "svelte";

import type { Writable } from "svelte/store";

  import type { ModuleCard } from "../../../common/types/module-card";
  import type { UIInput } from "../../../common/types/ui-input";
  import { environment } from "../../../stores/environment";


  export let moduleConfig : ModuleCard | UIInput;
  export let bopModules : Writable<BopsConfigurationEntry[]>;

  let ref : HTMLDivElement;
  export let moving = false;

  const dispatch = createEventDispatcher<{ movementStopped : MouseEvent }>();

  function startMovement (event : MouseEvent) {
    if(event.button !== 0) return;

    ref.style.zIndex = "1";
    ref.style.opacity = "0.5";
    moving = true
  }
  
  function stopMovement (event : MouseEvent) {
    if(moving) {
      ref.style.opacity = "1"
      ref.style.zIndex = "0"
      moving = false
      dispatch("movementStopped", event);
    }
  }

  function moveCard (event : MouseEvent) {
    if(moving) {
      moduleConfig.position = moduleConfig.position.moveBy(event.movementX/$environment.scale, event.movementY/$environment.scale);
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
  <slot name="content"/>
</div>
<svelte:window on:mousemove={moveCard} on:mouseup={(event) => stopMovement(event)}/>

<style lang="scss">
  .card {
    position: absolute;
    user-select: none;
    transition: opacity 260ms ease-in-out;
  }
</style>
