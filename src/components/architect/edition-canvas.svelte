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
  import Trash from "./trash.svelte";
  import { environment } from "../../stores/environment";
import List from "../list/list.svelte";

  let currentBop : UICompliantBop;
  let trashRect : DOMRect;
  let canvas : HTMLCanvasElement;
  let context : CanvasRenderingContext2D;

  function adjustCanvas() {
    const canvasScale = canvas.clientWidth/canvas.width
    canvas.width *= canvasScale;
    canvas.height *= canvasScale;

    context.strokeStyle = "#ffffff";
    context.lineWidth = 2
  }


  const mount = new Promise<void>(resolve => { 
    onMount(async () => {
      context = canvas.getContext("2d");
      adjustCanvas();

      bopStore.subscribe(bop => {
        currentBop = bop;
        updateTraces(context, bop);
      })
      environment.subscribe(() => {
        setTimeout(() => updateTraces(context, currentBop), 1); 
      })
    })
    resolve()
  });

  let moving = false;

  function startMovement (event : MouseEvent) {
    moving = event.button === 1 
  }
  function stopMovement () { moving = false }

  function moveCard (event : MouseEvent) {
    if(moving) {
      bopStore.update(bop => {
        bop.configuration.forEach(module => {
          module.position.x += event.movementX/$environment.scale
          module.position.y += event.movementY/$environment.scale
        });
        return bop;
      })
    }
  }

  async function handleMouseWheel (e : WheelEvent) {
    if(e.deltaY > 0) $environment.scale *= 1.1;
    else if(e.deltaY < 0) $environment.scale /= 1.1;
  }

  function copyBOpToClipboard() {
    console.log(currentBop);
    // console.log(moduleConnections)
    // TODO filter out ui properties
    navigator.clipboard.writeText(beautify(currentBop, null, 1, 110))
  }
</script>

<div class="architect" id="architect">
  <canvas class="canvas" bind:this={canvas}/>
    <ModuleStore></ModuleStore>
    <div class="modulesArea" on:mousedown={startMovement} on:wheel={handleMouseWheel}>
      {#await mount}
        <p>Loading...</p>
      {:then _done} 
        {#each currentBop.configuration as config (config.key)}
          <Module moduleConfig={config} trashPosition={trashRect}/>
        {/each}
      {/await}
      
    </div>
  <input class="buttonCpy" type="button" value="Copy Bop" on:click={() => copyBOpToClipboard()}>
  <input class="buttonScl" type="button" value="Reset Scale" on:click={() => { $environment.scale=1 }}>
  <Trash bind:trashRect/>
</div>
<svelte:window on:mousemove={moveCard} on:mouseup={stopMovement} on:resize={adjustCanvas}/>



<style>
  .canvas {
    position: relative;
    width: 100%;
    height: 100%;
    scale: 1;
    /* background: url("../../../static/images/dotted-back.jpg") rgb(16, 15, 17); */
    background-color: gray;
  }

  .buttonCpy {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .buttonScl {
    position: absolute;
    top: 10px;
    left: 100px;
  }



  .modulesArea {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
  }
</style>