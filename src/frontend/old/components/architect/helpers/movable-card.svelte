<script lang="ts">
import type { ArchitectContext } from "src/entities/auxiliary-entities/architect-context";
import { createEventDispatcher, getContext } from "svelte";
import { Coordinate } from "../../../common/types/geometry";
import type { ModuleCard } from "../../../common/types/module-card";

let context = getContext<ArchitectContext>("architectContext");
const { mousePos, scale, originPos } = context;

type MovingPosision = {
  origin : Coordinate;
  delta : Coordinate;
}

export let moduleConfig : ModuleCard;
export let onMove : () => void = undefined;
const { position } = moduleConfig;

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
  if (context.isPanning) return;

  movingPos.origin = new Coordinate($position.x, $position.y);
  movingPos.delta = new Coordinate(0, 0);

  moving = true;
  lastMousePosition = $mousePos;
}

function stopMovement (event : MouseEvent) : void {
  if(moving) {
    moving = false;
    dispatch("movementStopped", event);
  }

  onMove();
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, max-lines-per-function
function moveCard (node : Node, mousePosition : {x : number; y : number}) {
  return {
    // eslint-disable-next-line max-lines-per-function
    update: (updateMousePos : {x : number; y : number}) : void => {
      if(moving) {
        movingPos.delta
          .moveBy(
            (updateMousePos.x - lastMousePosition.x)/$scale,
            (updateMousePos.y - lastMousePosition.y)/$scale);
        lastMousePosition = updateMousePos;
        let newX =  movingPos.origin.x + movingPos.delta.x;
        let newY =  movingPos.origin.y + movingPos.delta.y;
        moduleConfig.position.update((updatePosition) : Coordinate => {
          updatePosition.moveTo(newX, newY);
          return updatePosition;
        });

        if (onMove) onMove();
      }
    },
  };
}

$: movingStyle = moving ? "z-10 opacity-60" : "z-0 opacity-100";
$: posX = $position.x;
$: posY = $position.y;

</script>

<div use:moveCard={$mousePos} class="card {movingStyle}" bind:this={ref} on:mousedown={startMovement} on:mouseup={stopMovement}
  style="
    left: {(posX+ $originPos.x)*$scale}px; 
    top: {(posY + $originPos.y)*$scale}px; 
    transform: scale({$scale}) translateX(-50%) translateY(-50%);
    transform-origin: {$originPos.x}px {$originPos.y}px;"
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
