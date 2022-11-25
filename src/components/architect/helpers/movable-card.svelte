<script lang="ts">
import type { BopsConfigurationEntry }
  from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import type { ArchitectContext } from "src/entities/auxiliary-entities/architect-context";
import { createEventDispatcher, getContext } from "svelte";

import type { Writable } from "svelte/store";
import { AdvancedMath } from "../../../common/helpers/math";
import { Coordinate } from "../../../common/types/geometry";

import type { ModuleCard } from "../../../common/types/module-card";
import type { UIInput } from "../../../common/types/ui-input";
import { environment } from "../../../stores/environment";

let context = getContext<ArchitectContext>("architectContext");
const { dragging, mousePos } = context;

type MovingPosision = {
  origin : Coordinate;
  delta : Coordinate;
}

export let moduleConfig : ModuleCard | UIInput;
export let bopModules : Writable<BopsConfigurationEntry[]>;

let ref : HTMLDivElement;
export let moving = false;
let movingPos : MovingPosision = {
  origin : undefined,
  delta : undefined,
};

const dispatch = createEventDispatcher<{ movementStopped : MouseEvent }>();
let lastMousePosition;

function startMovement (event : MouseEvent) : void {
  if(event.button !== 0) return;

  movingPos.origin = new Coordinate(moduleConfig.position.x, moduleConfig.position.y);
  movingPos.delta = new Coordinate(0, 0);

  moving = true;
  lastMousePosition = $mousePos;
}

function stopMovement (event : MouseEvent) : void {
  if(moving) {
    moving = false;
    dispatch("movementStopped", event);
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, max-lines-per-function
function moveCard (node : Node, mousePosition : {x : number; y : number}) {
  return {
    update: (updateMousePos : {x : number; y : number}) : void => {
      if(moving) {
        movingPos.delta
          .moveBy(
            (updateMousePos.x - lastMousePosition.x)/$environment.scale,
            (updateMousePos.y - lastMousePosition.y)/$environment.scale);
        lastMousePosition = updateMousePos;
        let newX =  movingPos.origin.x + movingPos.delta.x;
        let newY =  movingPos.origin.y + movingPos.delta.y;
        moduleConfig.position = moduleConfig.position.moveTo(newX, newY);
        bopModules.update(modules => modules);
      }
    },
  };
}

$: movingStyle = moving ? "z-10 opacity-60" : "z-0 opacity-100";

</script>

<div use:moveCard={$mousePos} class="card {movingStyle}" bind:this={ref} on:mousedown={startMovement} on:mouseup={stopMovement}
  style="
    left: {(moduleConfig.position.x + $environment.origin.x)*$environment.scale}px; 
    top: {(moduleConfig.position.y + $environment.origin.y)*$environment.scale}px; 
    transform: scale({$environment.scale}) translateX(-50%) translateY(-50%);
    transform-origin: {$environment.origin.x}px {$environment.origin.y}px;"
>
  <slot/>
</div>

<style lang="scss">
  .card {
    position: absolute;
    user-select: none;
    transition: opacity 260ms ease-in-out;
  }
</style>
