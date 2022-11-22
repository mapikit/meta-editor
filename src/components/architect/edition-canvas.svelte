<script lang="ts">
  import Module from "./module-cards/module-card.svelte";
  import { onDestroy, onMount, setContext } from "svelte";
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
  import { Tools, toolsController } from "./view-store";
  import { ShortcutsController } from "../../common/helpers/shortcut-controller";
  import { ArchitectContext } from "../../entities/auxiliary-entities/architect-context";
	import ModuleCard from "./module-cards/module-card.svelte";

  export let currentBop : UIBusinessOperation;

  // Editing Context START
  const editingContext = new ArchitectContext;

  setContext("currentBop", currentBop);
  setContext("architectContext", editingContext);
  // Editing Context END

  let configurationHistory;
  let modulesInConfig : ModuleCard[];
  let trash : HTMLDivElement;
  let canvas : HTMLCanvasElement;
  let context : CanvasRenderingContext2D;
  let cutting = false;
  let storeHidden = true;
  let modulesLayer : HTMLElement;
  let overlayLayer : HTMLElement;

  const shortcuts = new ShortcutsController();

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

    shortcuts.setShortcut("c", () => { cutting = !cutting; });

    editingContext.modulesLayer.set(modulesLayer);
    editingContext.overlayLayer.set(overlayLayer);
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
      case "f":
        environment.update(env => {
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
        environment.update(env => {env.functionalTraces = false; return env;});
        break;
    };
    // bopStore.update(bop => bop);
    cutting = cutting;
  }

  function handleMouseMove (event : MouseEvent) : void {
    editingContext.mousePos.set({ x: event.clientX, y: event.clientY });

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

  let currentTool = toolsController.currentTool;
  let { mouseOverDraggable } = editingContext;

  const getCursorStyle = (...dummyArgs : unknown[]) : string => {
    if ($dragging) return "cursor-grabbing";
    if ($mouseOverDraggable) return "cursor-grab";
    if ($currentTool === Tools.cutTool) return "cursor-crosshair";
    if ($currentTool === Tools.panTool) return "cursor-grab";
  };

  $: cursorStyle = getCursorStyle($currentTool, $dragging, $mouseOverDraggable);
  let { mousePos, draggingElement, dragging } = editingContext;

  $: pos = $mousePos;

  // eslint-disable-next-line max-lines-per-function
  const releaseDrag = (event : MouseEvent) : void => {
    if (event.button !== 0) { // right click mouseup
      return;
    }

    if ($dragging && $draggingElement.type === "module") {
      console.log("SHOULD SPAWN MODULE HERE");

      currentBop.configuration.update(modules => {
        const newModule : ModuleCard = { ...$draggingElement.data as object } as ModuleCard;
        newModule.position = new Coordinate(pos.x, pos.y)
          .moveBy(-$environment.origin.x - 106, -$environment.origin.y - 60)
          .scale(1/$environment.scale),
        modules.push(newModule);
        return modules;
      });
    }

    if (event.button === 0) { // Left click drag
      editingContext.dragging.set(false);
    }
  };
</script>

<div class="relative w-full h-full {cursorStyle}" id="architect"
on:mouseup={releaseDrag}
>
  {JSON.stringify(pos)}
  <canvas class="absolute top-0 left-0 w-full h-full" bind:this={canvas}/>
  <ModuleStore bind:hidden={storeHidden} currentBop={currentBop}/>
  <div class="modulesArea" 
    on:mousedown={startMovement}
    on:wheel={handleMouseWheel}
    bind:this={modulesLayer}
  > <!-- Modules Layer-->
    {#each modulesInConfig as config (config.key)}
      {#if config.moduleType !== "output"}
        <Module bopModules={currentBop.configuration} bopConstants={currentBop.constants} moduleConfig={config} trash={trash}/>
      {/if}
    {/each}
    <InputCard bopModules={currentBop.configuration} configuration={currentBop.input}/>
    <OutputCard bopModules={currentBop.configuration} configuration={currentBop.output} bopConstants={currentBop.constants}/>      
  </div>
  <div class="fixed top-0 left-0 w-full h-full pointer-events-none" bind:this={overlayLayer}/>
  <CurrentBopNametag businessOperation={currentBop}/>
  <ArchitectToolbar />
  <Trash bind:ref={trash} bind:hidden={storeHidden} bopModules={currentBop.configuration}/>
</div>
<svelte:window 
  on:mousemove={handleMouseMove} 
  on:mouseup={() => panning = false}
  on:keydown={shortcuts.getShortcutEventHandler}
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