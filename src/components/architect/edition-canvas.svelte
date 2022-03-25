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
  import { Coordinate, Dimensions } from "../../common/types/geometry";

  let currentBop : UICompliantBop;
  let trashRect : DOMRect;
  let canvas : HTMLCanvasElement;
  let context : CanvasRenderingContext2D;
  let cutting = false;
  let storeHidden = true;

  
  function adjustCanvas() {
    const containerDimensions = canvas.parentElement.getBoundingClientRect()
    canvas.width = containerDimensions.width;
    canvas.height = containerDimensions.height;
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2

    updateTraces(context, $bopStore, $environment)
  }


  const mount = new Promise<void>(resolve => {
    onMount(async () => {
      context = canvas.getContext("2d");
      adjustCanvas();

      $environment.origin.moveTo(canvas.width/2, canvas.height/2)

      bopStore.subscribe(bop => {
        currentBop = bop;
        updateTraces(context, bop, $environment);
      })
      environment.subscribe(() => {
        updateTraces(context, currentBop, $environment);
        setTimeout(() => updateTraces(context, currentBop, $environment), 1);
        // Investigate and avoid this kind of repetition & timeout
        // Timeout Only: traces have "springness" (modules don't)
        // No Timeout: traces don't update correctly (obvious with scaling)
      })
    })
    resolve()
  });

  let panning = false;

  function startMovement (event : MouseEvent) {
    if(cutting) {
      const toCut = updateTraces(context, currentBop, $environment,{ mouse: { x: event.x, y: event.y }});
      for(const keyDepTuple of toCut) {
        bopStore.update(bop => {
          const module = bop.configuration.find(mod => mod.key === keyDepTuple[0]);
          const depIndex = module.dependencies.findIndex(dep => dep === keyDepTuple[1]);
          module.dependencies.splice(depIndex, 1);
          return bop;
        });
      }
      context.shadowBlur = 0;
    }
    panning = event.button === 1 
  }

  function detectShortcut (event : KeyboardEvent) {
    console.log($environment);
    context.shadowBlur = 0;
    switch (event.key) {
      case "c":
        cutting = !cutting;
        event.preventDefault();
        break;
      case "Escape":
        cutting = false;
        break;
    }
    bopStore.update(bop => bop);
    cutting = cutting;
  }

  function handleMouseMove (event : MouseEvent) {
    if(cutting) {
      updateTraces(context, currentBop, $environment, { mouse: { x: event.x, y: event.y } });
    }
    else if(panning) {
      environment.update(env => { 
        env.origin.moveBy(event.movementX, event.movementY);
        return env;
      })
    }
  }

  async function handleMouseWheel (e : WheelEvent) {
    if(e.deltaY > 0) $environment.scale *= 1.1;
    else if(e.deltaY < 0) $environment.scale /= 1.1;
    $environment.origin.moveBy(
      ...$environment.origin.newPointer(new Coordinate(e.x, e.y)).scale(-0.1*Math.sign(e.deltaY)).decompose()
    )
  }

  function fitModules() {

    let maxX =-Infinity, maxY=-Infinity, minX=Infinity, minY=Infinity;
    $bopStore.configuration.forEach(module => {
      const correctedWidth = module.dimensions.width
      const correctedHeight = module.dimensions.height
      if(module.position.x < minX) minX = module.position.x;
      if(module.position.y < minY) minY = module.position.y;
      if(module.position.x > maxX) maxX = module.position.x+correctedWidth;
      if(module.position.y > maxY) maxY = module.position.y+correctedHeight;
    })

    const width = (maxX - minX) + 50
    const height = (maxY - minY) + 50
    const centerX = width/2
    const centerY = height/2

    const scaleX = canvas.width/width;
    const scaleY = canvas.height/height;

    // console.log("=============")
    // console.log(minX, minY, maxX, maxY);
    // console.log(width, height)
    // console.log(centerX, centerY)
    // // console.log(scaleX, scaleY)


    environment.update(env => {
      env.scale = Math.min(scaleX, scaleY);

      const areaCenter = new Coordinate(centerX, centerY)
      const areaToOrigin = areaCenter.newPointer(new Coordinate(0, 0));

      const canvasCenter = new Coordinate(canvas.width/2, canvas.height/2);

      areaToOrigin.scale(1/env.scale);
      const finalOriginPosition = new Coordinate(0, 0).moveBy(areaToOrigin.x, areaToOrigin.y);
      env.origin.moveTo(finalOriginPosition.x, finalOriginPosition.y);
      return env;
    })

  }

  function copyBOpToClipboard () {
    console.log(currentBop);
    // TODO filter out ui properties
    navigator.clipboard.writeText(beautify(currentBop, null, 1, 110));
  }
</script>

<div class="architect" id="architect" >
  <canvas class="canvas" bind:this={canvas}/>
    <ModuleStore bind:hidden={storeHidden}/>
    <div 
      class="modulesArea" 
      on:mousedown={startMovement} on:wheel={handleMouseWheel} style="cursor: {cutting ? "crosshair" : "default"};">
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
  <input class="buttonFit" type="button" value="Fit All" on:click={() => fitModules()}>
  <input class="adjust" type="button" value="Adjust" on:click={() => adjustCanvas()}>


  <Trash bind:trashRect bind:hidden={storeHidden}/>
</div>
<svelte:window 
  on:mousemove={handleMouseMove} 
  on:mouseup={() => panning = false} 
  on:keydown={detectShortcut}
  on:resize={adjustCanvas}
  />



<style>
  .canvas {
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    /* background: url("../../../static/images/dotted-back.jpg") rgb(16, 15, 17); */
    background-color: gray;
    /* width: 100%;
    height: 100%; */
  }

  .buttonCpy {
    position: absolute;
    top: 10px;
    left: 90px;
  }

  .buttonScl {
    position: absolute;
    top: 10px;
    left: 160px;
  }

  .buttonFit {
    position: absolute;
    top: 10px;
    left: 240px;
  }

  .adjust {
    position: absolute;
    top: 10px;
    left: 290px;
  }


  .modulesArea {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    top: 0px;
    left: 0px;
  }

  .architect {
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>