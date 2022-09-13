<script lang="ts">
  import Module from "./module-cards/module-card.svelte";
  import { onDestroy, onMount } from "svelte";
  import { updateTraces } from "./update-traces";
  import ModuleStore from "./module-store.svelte";
  import Trash from "./trash.svelte";
  import { environment } from "../../stores/environment";
  import { Coordinate } from "../../common/types/geometry";
  import InputCard from "./input-card.svelte";
  import OutputCard from "./output-card.svelte";
  import { UIBusinessOperation } from "../../entities/business-operation";
  import { get } from "svelte/store";
  import type { ModuleCard } from "../../common/types/module-card";
  import { sectionsMap } from "./helpers/sections-map";
  import { History } from "../../common/helpers/generic-history";
  import ArchitectToolbar from "./architect-toolbar.svelte";
  import CurrentBopNametag from "./current-bop-nametag.svelte";

  export let currentBop : UIBusinessOperation;

  let configurationHistory;
  let modulesInConfig : ModuleCard[];
  let trash : HTMLDivElement;
  let canvas : HTMLCanvasElement;
  let context : CanvasRenderingContext2D;
  let cutting = false;
  let storeHidden = true;

  if (currentBop) {
    configurationHistory = new History({
      storeToWatch: currentBop.configuration,
      validatingFunction: UIBusinessOperation.rebuildModuleCards,
    });

    currentBop.configuration?.subscribe(config => {
      modulesInConfig = get(currentBop.configuration);
      return config;
    });

    sectionsMap.refreshConnections(get(currentBop.configuration));
  }

  onDestroy(() => configurationHistory.unsubscribe());
  
  function adjustCanvas () : void {
    const containerDimensions = canvas.parentElement.getBoundingClientRect();
    canvas.width = containerDimensions.width;
    canvas.height = containerDimensions.height;
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;

    // updateTraces();
    // const canvasScale = canvas.clientWidth/canvas.width;
    // canvas.width *= canvasScale;
    // canvas.height *= canvasScale;

    updateTraces();

    context.lineWidth = 2;
  }

  onMount(() => {
    context = canvas.getContext("2d");
    $environment.canvasContext = context;
    $environment.canvasOffset = canvas.getBoundingClientRect();

    $environment.origin.moveTo(canvas.width/2, canvas.height/2);
    sectionsMap.refreshConnections(get(currentBop.configuration));

    currentBop.configuration.subscribe(() => {
      updateTraces();
    });

    environment.subscribe(() => setTimeout(() => updateTraces(), 1));
    // Investigate and avoid this kind of repetition & timeout
    // Timeout Only: traces have "springness" (modules don't)
    // No Timeout: traces don't update correctly (obvious with scaling)
    adjustCanvas();
  });

  let panning = false;

  // eslint-disable-next-line max-lines-per-function
  function startMovement (event : MouseEvent) : void {
    if(cutting) {
      const linesToCut = updateTraces({ cutting: event });
      // eslint-disable-next-line max-lines-per-function
      currentBop.configuration.update(config => {
        for(const identifier of linesToCut) {
          const moduleId = identifier.split(".")[0];
          const targetPath = identifier.split(".").slice(1).join(".");
          let module : ModuleCard;
          let dependencyIndex : number;
          if(!targetPath) {
            // Functional dep id pattern `originKey_parentKey`
            const origin = Number(moduleId.split("_")[0]);
            const parentKey = Number(moduleId.split("_")[1]);
            module = config.find(_module => _module.key === parentKey);
            dependencyIndex = module.dependencies.findIndex(dep => dep.origin === origin && dep.targetPath === undefined);
          } else {
            module = config.find(_module => _module.key === Number(moduleId));
            dependencyIndex = module.dependencies.findIndex(dependency => dependency.targetPath === targetPath);
          }

          module.dependencies.splice(dependencyIndex, 1);
          sectionsMap.refreshConnections(get(currentBop.configuration));
        }

        return config;
      });
      context.shadowBlur = 0;
    }
    panning = event.button === 1;
  }

  // eslint-disable-next-line max-lines-per-function
  function detectShortcut (event : KeyboardEvent) : void {
    context.shadowBlur = 0;
    if(document.activeElement.tagName === "INPUT") return;
    switch (event.key) {
      case "c":
        cutting = !cutting;
        event.preventDefault();
        break;
      case "f":
        $environment.update(env => {
          env.functionalTraces = !env.functionalTraces; return env;
        });
        event.preventDefault();
        break;
      case "z":
        if(event.ctrlKey) {
          configurationHistory.undo();
          setTimeout(updateTraces, 20);
          event.preventDefault();
        }
        break;
      case "r":
        if(event.ctrlKey) {
          configurationHistory.redo();
          setTimeout(updateTraces, 20);
          event.preventDefault();
        }
        break;
      case "Escape":
        cutting = false;
        $environment.update(env => {env.functionalTraces = false; return env;});
        break;
    };
    // bopStore.update(bop => bop);
    cutting = cutting;
  }

  function handleMouseMove (event : MouseEvent) : void {
    if(cutting) updateTraces({ cutting: event });
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
    // bopStore.configuration.forEach(module => {
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
</script>

<div class="relative w-full h-full" id="architect">
  <canvas class="absolute top-0 left-0 w-full h-full" bind:this={canvas}/>
    <ModuleStore bind:hidden={storeHidden} currentBop={currentBop}/>
    <div 
      class="modulesArea" 
      on:mousedown={startMovement} on:wheel={handleMouseWheel} style="cursor: {cutting ? "crosshair" : "default"};">
        {#each modulesInConfig as config (config.key)}
          {#if config.moduleType !== "output"}
            <Module bopModules={currentBop.configuration} bopConstants={currentBop.constants} moduleConfig={config} trash={trash}/>
          {/if}
        {/each}
        <InputCard bopModules={currentBop.configuration} configuration={currentBop.input}/>
        <OutputCard bopModules={currentBop.configuration} configuration={currentBop.output} bopConstants={currentBop.constants}/>      
    </div>
  <CurrentBopNametag businessOperation={currentBop}/>
  <ArchitectToolbar />
  <Trash bind:ref={trash} bind:hidden={storeHidden} bopModules={currentBop.configuration}/>
</div>
<svelte:window 
  on:mousemove={handleMouseMove} 
  on:mouseup={() => panning = false}
  on:keydown={detectShortcut}
  on:resize={adjustCanvas}
  />

<style>
  .modulesArea {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    top: 0px;
    left: 0px;
  }
</style>