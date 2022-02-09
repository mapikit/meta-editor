<script lang="ts">
  // There be dragons beyond this point, take all this code with a pinch of salt
  // (Many) Changes are to be expected
  import Module from "./module-cards/module-card.svelte";
  import { onMount } from "svelte";
  import { updateTraces } from "./update-traces";
  import beautify from "json-beautify";
  import type { UICompliantBop } from "../../common/types/ui-bop";
  import { bopStore } from "../../stores/bop-store";
  import ModuleStore from "./module-store.svelte";
  import { moduleConnections } from "../../stores/connection-stores";
  import Trash from "./trash.svelte";

  let currentBop : UICompliantBop;
  let trashRect : DOMRect;
  let canvas : HTMLCanvasElement;
  let context : CanvasRenderingContext2D;
  let scale : number = 1;
  let modulesArea : HTMLDivElement;

  bopStore.subscribe(bop => currentBop = bop)

  function adjustCanvas() {
    const scale = canvas.clientWidth/canvas.width
    canvas.width *= scale;
    canvas.height *= scale;

    context = canvas.getContext("2d");

    context.strokeStyle = "#ffffff";
    context.lineWidth = 2
    updateTraces(context, canvas.height, canvas.width);
  }

  onMount(() => {
    adjustCanvas();

    bopStore.subscribe(() => {
      updateTraces(context, canvas.height, canvas.width);
    })
  })

  let moving = false;

  function startMovement (event : MouseEvent) { moving = event.button === 1 }
  function stopMovement () { moving = false }

  function moveCard (event : MouseEvent) {
    if(moving) {
      bopStore.update(bop => {
        bop.configuration.forEach(module => {
          module.position.x += event.movementX/scale
          module.position.y += event.movementY/scale
        });
        return bop;
      })
    }
  }

  function handleMouseWheel (e : WheelEvent) {
    if(e.deltaY > 0) scale += 0.1;
    else if(e.deltaY < 0) scale -= 0.1
    modulesArea.style.scale = scale.toString();
    updateTraces(context, canvas.height, canvas.width);
  }

  function copyBOpToClipboard() {
    console.log(currentBop);
    console.log(moduleConnections)
    // TODO filter out ui properties
    navigator.clipboard.writeText(beautify(currentBop, null, 1, 110))
  }
</script>

<div class="architect" id="architect" on:wheel={handleMouseWheel}>
  <canvas class="canvas" bind:this={canvas} on:mousedown={startMovement}/>
    <ModuleStore></ModuleStore>
    <div class="modulesArea" id="modulesArea" bind:this={modulesArea}>
      {#each currentBop.configuration as config (config.key)}
        <Module moduleConfig={config} trashPosition={trashRect}/>
      {/each}
    </div>
  <input class="buttonCpy" type="button" value="Copy Bop" on:click={() => copyBOpToClipboard()}>
  <Trash bind:trashRect/>
</div>
<svelte:window on:mousemove={moveCard} on:mouseup={stopMovement} on:resize={adjustCanvas}/>



<style>
  .canvas {
    position: relative;
    width: 100%;
    height: 100%;
    /* background: url("../../../static/images/dotted-back.jpg") rgb(16, 15, 17); */
    background-color: gray;
  }

  .buttonCpy {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .modulesArea {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }
</style>