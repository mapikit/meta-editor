<script lang="ts">
  import Module from "./module-cards/module-card.svelte";
  import { onDestroy, onMount, setContext } from "svelte";
  import { CanvasUtils } from "./canvas-utils";
  import ModuleStore from "./module-store.svelte";
  import Trash from "./trash.svelte";
  import { Coordinate } from "../../common/types/geometry";
  import InputCard from "./input-card.svelte";
  import OutputCard from "./output-card.svelte";
  import type { UIBusinessOperation } from "../../entities/business-operation";
  import { get, writable } from "svelte/store";
  import { ModuleCard } from "../../common/types/module-card";
  import { connectionsManager } from "./helpers/connections-manager";
  import { History } from "../../common/helpers/generic-history";
  import ArchitectToolbar from "./architect-toolbar.svelte";
  import CurrentBopNametag from "./current-bop-nametag.svelte";
  import { ShortcutsController } from "../../common/helpers/shortcut-controller";
  import { ArchitectContext } from "../../entities/auxiliary-entities/architect-context";
  import ArchitectCanvas from "./architect-canvas.svelte";
  import { getAvailableKey } from "./helpers/get-available-key";

  export let currentBop : UIBusinessOperation;

  // Editing Context START
  const editingContext = new ArchitectContext;
  const shortcuts = new ShortcutsController();
  const keyDownShortcuts = new ShortcutsController();
  const keyUpShortcuts = new ShortcutsController();
  const canvasUtils = new CanvasUtils(editingContext.scale, editingContext.originPos);

  setContext("currentBop", currentBop);
  setContext("architectContext", editingContext);
  setContext("shortcutsController", shortcuts);
  setContext("keyDownShortcutsController", keyDownShortcuts);
  setContext("keyUpShortcutsController", keyUpShortcuts);
  setContext("canvasContext", canvasUtils);
  // Editing Context END

  let configurationHistory;
  let modulesInConfig : ModuleCard[];
  let trash : HTMLDivElement;
  let modulesLayer : HTMLElement;
  let overlayLayer : HTMLElement;

  if (currentBop) {
    configurationHistory = new History({
      storeToWatch: currentBop.configuration,
    });

    currentBop.configuration?.subscribe(config => {
      modulesInConfig = config;
    });

    connectionsManager.refreshConnections(get(currentBop.configuration));
  }

  onDestroy(() => configurationHistory.unsubscribe());

  // eslint-disable-next-line max-lines-per-function
  onMount(() => {
    shortcuts.setShortcut("c", () => {
      if (editingContext.isCutting) {
        editingContext.currentMode.set("default");
        return;
      }

      editingContext.currentMode.set("cutting");
    });

    // Pressing space
    keyDownShortcuts.setShortcut(" ", () => {
      if (!editingContext.isPanning) {
        editingContext.currentMode.set("panning");
      }
    });

    // Released space
    keyUpShortcuts.setShortcut(" ", () => {
      editingContext.currentMode.set("default");
    });

    editingContext.modulesLayer.set(modulesLayer);
    editingContext.overlayLayer.set(overlayLayer);
  });

  // eslint-disable-next-line max-lines-per-function
  function startMovement (event : MouseEvent) : void {
    if(editingContext.isCutting) {
      // const linesToCut = updateTraces();
      // eslint-disable-next-line max-lines-per-function
      // currentBop;
    }
  }

  function handleMouseMove (event : MouseEvent) : void {
    editingContext.mousePos.set({ x: event.clientX, y: event.clientY });

    if(editingContext.isPanning && event.buttons === 1) {
      panningActive.set(true);
      editingContext.originPos.update(origin => {
        origin.moveBy(event.movementX, event.movementY);
        return origin;
      });

      return;
    }

    panningActive.set(false);
  }

  $: panningActive = writable(false);
  $: scale = editingContext.scale;
  $: originPos = editingContext.originPos;

  function handleMouseWheel (e : WheelEvent) : void {
    if(e.deltaY > 0) editingContext.scale.set($scale / 1.1) ;
    else if(e.deltaY < 0 && $scale < 2) editingContext.scale.set($scale * 1.1);
    else return;
    originPos.set($originPos.moveBy(
      ...$originPos.newPointer(new Coordinate(e.x, e.y)).scale(-0.1*Math.sign(e.deltaY * -1)).decompose(),
    ));
  }

  let { mouseOverDraggable, currentMode } = editingContext;

  const getCursorStyle = (...dummyArgs : unknown[]) : string => {
    if ($dragging) return "cursor-grabbing";
    if ($mouseOverDraggable) return "cursor-grab";
    if (editingContext.isCutting) return "cursor-crosshair";
    if (editingContext.isPanning && !$panningActive) return "cursor-grab";
    if (editingContext.isPanning && $panningActive) return "cursor-grabbing";
  };

  $: cursorStyle = getCursorStyle($dragging, $mouseOverDraggable, $currentMode, $panningActive);
  let { mousePos, draggingElement, dragging, mouseOverModule } = editingContext;

  $: pos = $mousePos;

  // eslint-disable-next-line max-lines-per-function
  const releaseDrag = (event : MouseEvent) : void => {
    if (event.button !== 0) { // right click mouseup
      return;
    }

    if ($dragging && $draggingElement.type === "module") {
      //eslint-disable-next-line max-lines-per-function
      currentBop.configuration.update(modules => {
        const draggedModuleData = $draggingElement.data as ModuleCard;
        const newModule : ModuleCard = ModuleCard.generate({
          position: new Coordinate(0, 0),
          bopId: draggedModuleData.bopId,
          moduleName: draggedModuleData.moduleName,
          moduleType: draggedModuleData.moduleType,
          modulePackage: draggedModuleData.modulePackage,
          key: getAvailableKey(modules),
          input: get(draggedModuleData.storedDefinition).input,
          output: get(draggedModuleData.storedDefinition).output,
        });

        newModule.position.set(new Coordinate(pos.x, pos.y)
          .moveBy(-$originPos.x - 106, -$originPos.y - 60)
          .scale(1/$scale));
        modules.push(newModule);

        return modules;
      });
    }

    if (event.button === 0) { // Left click drag
      editingContext.dragging.set(false);
    }
  };

  $: generatedInput = currentBop.configuration && currentBop.input;
  $: generatedOutput = currentBop.configuration && currentBop.output;
  
  onMount(() => {
    canvasUtils.centralize();
  });
</script>

<div class="relative w-full h-full {cursorStyle}" id="architect"
on:mouseup={releaseDrag}
on:mousemove={handleMouseMove}
>
  {JSON.stringify(pos)}
  <ArchitectCanvas/>
  <ModuleStore currentBop={currentBop}/>
  <div class="absolute bottom-0">
    {$dragging } : { $draggingElement?.type }
    OverModule: {$mouseOverModule?.type }
    {panningActive};
  </div>
  <div class="modulesArea" 
    on:mousedown={startMovement}
    on:wheel={handleMouseWheel}
    bind:this={modulesLayer}
  > <!-- Modules Layer-->
    {#each modulesInConfig as config (config.key)}
      {#if config.moduleType !== "output"}
        <Module moduleConfig={config} trash={trash}/>
      {/if}
    {/each}
    <InputCard configuration={generatedInput}/>
    <OutputCard moduleConfig={generatedOutput}/>
  </div>
  <div class="fixed top-0 left-0 w-full h-full pointer-events-none" bind:this={overlayLayer}/>
  <CurrentBopNametag businessOperation={currentBop}/>
  <ArchitectToolbar />
  <Trash bind:ref={trash} bopModules={currentBop.configuration}/>
</div>
<svelte:window
  on:keydown={keyDownShortcuts.getShortcutEventHandler}
  on:keydown={shortcuts.getShortcutEventHandler}
  on:keyup={keyUpShortcuts.getShortcutEventHandler}
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