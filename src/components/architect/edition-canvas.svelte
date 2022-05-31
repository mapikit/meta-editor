<script lang="ts">
  // There be dragons beyond this point, take all this code with a pinch of salt
  // (Many) Changes are to be expected
  import Module from "./module-cards/module-card.svelte";
  import { onMount } from "svelte";
  import { updateTraces } from "./update-traces";
  import beautify from "json-beautify";
  // import { bopStore } from "../../stores/bop-store";
  import ModuleStore from "./module-store.svelte";
  import Trash from "./trash.svelte";
  import { environment } from "../../stores/environment";
  import { Coordinate } from "../../common/types/geometry";
  import InputCard from "./input-card.svelte";
  import OutputCard from "./output-card.svelte";
  import type { UIBusinessOperation } from "../../entities/business-operation";
  import { get } from "svelte/store";
  import { navigation } from "../../lib/navigation";
  import { businessOperations } from "../../stores/configuration-store";
  import { getDeepStoreObject } from "./helpers/get-deep-store-obj";
  import type { ModuleCard } from "../../common/types/module-card";
import { sectionsMap } from "./helpers/sections-map";
  
  let currentBop : UIBusinessOperation = $businessOperations.find(bop => get(bop.id) === get(navigation.currentPathParams).bopId);
  let modulesInConfig : ModuleCard[];
  currentBop.configuration.subscribe(config => {
    modulesInConfig = get(currentBop.configuration)
    return config;
  })

  let trashRect : DOMRect;
  let canvas : HTMLCanvasElement;
  let context : CanvasRenderingContext2D;
  let cutting = false;
  let storeHidden = true;

   
  function adjustCanvas () : void {
    const containerDimensions = canvas.parentElement.getBoundingClientRect();
    canvas.width = containerDimensions.width;
    canvas.height = containerDimensions.height;
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;

    updateTraces(context, $environment);
    const canvasScale = canvas.clientWidth/canvas.width;
    canvas.width *= canvasScale;
    canvas.height *= canvasScale;

    context.lineWidth = 2;
  }


  const mount = new Promise<void>(resolve => {
    onMount(async () => {
      context = canvas.getContext("2d");
      adjustCanvas();

      $environment.origin.moveTo(canvas.width/2, canvas.height/2);

      currentBop.configuration.subscribe(bop => {
        updateTraces(context, $environment);
      });
      environment.subscribe(() => {
        setTimeout(() => updateTraces(context, $environment), 1);
        // Investigate and avoid this kind of repetition & timeout
        // Timeout Only: traces have "springness" (modules don't)
        // No Timeout: traces don't update correctly (obvious with scaling)
      });
    });
    resolve();
  });

  let panning = false;

  function startMovement (event : MouseEvent) : void {
    if(cutting) {
      const linesToCut = updateTraces(context, $environment, { mouse: { x: event.x, y: event.y }});
        currentBop.configuration.update(config => {
          for(const identifier of linesToCut) {
            const moduleKey = Number(identifier.split(".")[0]);
            const targetPath = identifier.split(".").slice(1).join(".");
            const module = config.find(module => module.key === moduleKey);
            const dependencyIndex = module.dependencies.findIndex(dependency => dependency.targetPath === targetPath);
            module.dependencies.splice(dependencyIndex, 1);
            sectionsMap.removeConnection(identifier);
          }

          return config;
        })
      context.shadowBlur = 0;
    }
    panning = event.button === 1;
  }

  function detectShortcut (event : KeyboardEvent) : void {
    context.shadowBlur = 0;
    switch (event.key) {
      case "c":
        cutting = !cutting;
        event.preventDefault();
        break;
      case "Escape":
        cutting = false;
        break;
    };
    // bopStore.update(bop => bop);
    cutting = cutting;
  }

  function handleMouseMove (event : MouseEvent) : void {
    if(cutting) {
      updateTraces(context, $environment, { mouse: { x: event.x, y: event.y } });
    }
    else if(panning) {
      environment.update(env => {
        env.origin.moveBy(event.movementX, event.movementY);
        return env;
      });
    }
  }

  function handleMouseWheel (e : WheelEvent) : void {
    if(e.deltaY > 0) $environment.scale *= 1.1;
    else if(e.deltaY < 0) $environment.scale /= 1.1;
    $environment.origin.moveBy(
      ...$environment.origin.newPointer(new Coordinate(e.x, e.y)).scale(-0.1*Math.sign(e.deltaY)).decompose(),
    );
  }

  function fitModules () : void {
    // let maxX =-Infinity, maxY=-Infinity, minX=Infinity, minY=Infinity;
    // $bopStore.configuration.forEach(module => {
    //   const correctedWidth = module.dimensions.width;
    //   const correctedHeight = module.dimensions.height;
    //   if(module.position.x < minX) minX = module.position.x;
    //   if(module.position.y < minY) minY = module.position.y;
    //   if(module.position.x > maxX) maxX = module.position.x+correctedWidth;
    //   if(module.position.y > maxY) maxY = module.position.y+correctedHeight;
    // });

    // const width = (maxX - minX) + 50;
    // const height = (maxY - minY) + 50;
    // const centerX = width/2;
    // const centerY = height/2;

    // const scaleX = canvas.width/width;
    // const scaleY = canvas.height/height;

    // // console.log("=============")
    // // console.log(minX, minY, maxX, maxY);
    // // console.log(width, height)
    // // console.log(centerX, centerY)
    // // // console.log(scaleX, scaleY)


    // environment.update(env => {
    //   env.scale = Math.min(scaleX, scaleY);

    //   const areaCenter = new Coordinate(centerX, centerY);
    //   const areaToOrigin = areaCenter.newPointer(new Coordinate(0, 0));

    //   const canvasCenter = new Coordinate(canvas.width/2, canvas.height/2);

    //   areaToOrigin.scale(1/env.scale);
    //   const finalOriginPosition = new Coordinate(0, 0).moveBy(areaToOrigin.x, areaToOrigin.y);
    //   env.origin.moveTo(finalOriginPosition.x, finalOriginPosition.y);
    //   return env;
    // });
  }

  function copyBOpToClipboard () {
    console.log(getDeepStoreObject(currentBop))
    console.log(sectionsMap);
    
    // TODO filter out ui properties
    navigator.clipboard.writeText(beautify(currentBop, null, 1, 110));
  }
</script>

<div class="architect" id="architect">
  <canvas class="canvas" bind:this={canvas}/>
    <ModuleStore bind:hidden={storeHidden} bind:currentBop/>
    <div 
      class="modulesArea" 
      on:mousedown={startMovement} on:wheel={handleMouseWheel} style="cursor: {cutting ? "crosshair" : "default"};">
      {#await mount}
        <p>Loading...</p>
      {:then _done}
        {#each modulesInConfig as config (config.key)}
          {#if config.moduleType !== "output"}
            <Module bopModules={currentBop.configuration} bopConstants={currentBop.constants} moduleConfig={config} trashPosition={trashRect}/>
          {/if}
        {/each}
        <InputCard bopModules={currentBop.configuration} configuration={currentBop.input}/>
        <OutputCard bopModules={currentBop.configuration} configuration={currentBop.output} bopConstants={currentBop.constants}/>
      {/await}
      
    </div>
  <input class="buttonCpy" type="button" value="Copy Bop" on:click={() => copyBOpToClipboard()}>
  <input class="buttonScl" type="button" value="Reset Scale" on:click={() => { $environment.scale=1; }}>
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
    position: absolute;
    top: 0;
    left: 0;
    /* background: url("../../../static/images/dotted-back.jpg") rgb(16, 15, 17); */
    background-color: gray;
    width: 100%;
    height: 100%;
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
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }
</style>