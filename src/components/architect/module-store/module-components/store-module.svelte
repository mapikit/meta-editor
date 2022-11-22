<script lang="ts">
  import { getAvailableKey } from "../../helpers/get-available-key";
  import StoreInput from "./store-input.svelte";
  import StoreOutput from "./store-output.svelte";
  import { environment } from "../../../../stores/environment";
  import type { ModuleType } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import { Coordinate } from "../../../../common/types/geometry";
  import type { Writable } from "svelte/store";
  import type { ModuleCard } from "../../../../common/types/module-card";
  import type { StoreModuleInfo } from "../../../../common/types/store-module-info";
  import Tooltip from "../../../../components/common/tooltip.svelte";
  import Draggable from "../../draggable.svelte";
  import type { ArchitectContext } from "../../../../entities/auxiliary-entities/architect-context";
  import { getContext } from "svelte";

  export let module : StoreModuleInfo;
  export let moduleType : ModuleType;
  export let storeLocked = false;
  export let bopModules : Writable<ModuleCard[]>;

  const context = getContext<ArchitectContext>("architectContext");
  let { dragging, draggingElement } = context;

  let moving = false;
  let ref : HTMLDivElement;
  let newCard : HTMLDivElement;
  let left = 0;
  let top = 0;
  let parentSchema = undefined;
  let tooltipVisible = false;

  function startMovement (event : MouseEvent) {
    storeLocked = true;
    moving = event.button === 0;
    let currentParent = document.getElementById("architect");
    newCard = currentParent.appendChild(ref.cloneNode(true)) as HTMLDivElement;
    newCard.style.position = "absolute";
    newCard.style.width = `${ref.getBoundingClientRect().width}px`;
    const currentPos = ref.getBoundingClientRect();
    const parentOffset = currentParent.getBoundingClientRect();
    top = currentPos.y-parentOffset.y;
    left = currentPos.x-parentOffset.x;
    newCard.style.left = `${left}px`;
    newCard.style.top = `${top}px`;
    ref.style.visibility = "hidden";
  }

  function getPackage (): string {
    switch (moduleType) {
      case "schemaFunction": return module.schemaName;
      default: return undefined;
    }
  }

  function stopMovement (event : MouseEvent) {
    moving = false;
    storeLocked = false;
    const storeRect = ref.closest("#store").getBoundingClientRect();
    if(newCard !== undefined) {
      if(event.x < storeRect.x) {
        bopModules.update(modules => {
          const newModule : ModuleCard = {
            dependencies: [],
            key: getAvailableKey(modules),
            moduleName: module.functionName,
            modulePackage: getPackage(),
            moduleType: moduleType,
            position: new Coordinate(left, top)
              .moveBy(-$environment.origin.x, -$environment.origin.y)
              .scale(1/$environment.scale),
            bopId: module["bopId"]
          };
          modules.push(newModule);
          return modules;
        })
      }
      newCard.remove()
      newCard = undefined;
      ref.style.visibility = "visible";
    }
    left = top = 0;
  }

  function moveCard (event : MouseEvent) {
    if(moving) {
      left += event.movementX;
      top += event.movementY;
      newCard.style.left = `${left}px`;
      newCard.style.top = `${top}px`;
    }
  }
  
  $: availableKey = getAvailableKey($bopModules);

  const moduleDragData = {
    dependencies: [],
    key: availableKey,
    moduleName: module.functionName,
    modulePackage: getPackage(),
    moduleType: moduleType,
    position: new Coordinate(left, top)
      .moveBy(-$environment.origin.x, -$environment.origin.y)
      .scale(1/$environment.scale),
    bopId: module["bopId"],
  };
</script>

<Draggable style={"w-full mt-4 first:mt-0"} dragType="module" dragElement={ref} dragData={moduleDragData}>
<div class="w-full shadow" bind:this={ref}>
  <div class="select-none min-w-[120px] bg-norbalt-350 rounded">
    <div class="h-8 bg-norbalt-300 rounded-t flex flex-row items-center justify-between">
      <slot name="functionalDep"/>
      <div class="flex flex-row h-4 ml-1">
        {#each [0,1,2] as num}
          <div class="h-full w-[2px] rounded bg-norbalt-100 ml-1.5"/>
        {/each}
      </div>
      <span class="text-offWhite" >{module.functionName}</span> {#if parentSchema} <span class="schemaName">@{parentSchema}</span> {/if}
      <div class="tooltipIcon"
        on:focus={undefined}
        on:mouseenter={() => { tooltipVisible = true; } }
        on:mouseleave={() => { tooltipVisible = false; } }
      >
  
      <Tooltip visible={tooltipVisible} tooltipContent={module["description"]} position="left"/>
    </div>
      <slot name="moduleNob" ></slot>
    </div>
    <div class="IO">
      <div class="inputs">
        {#each Object.keys(module.input) as key}
          <StoreInput  type={module.input[key].type}/>
        {/each}
      </div>
      <div class="separator"></div>
      <div class="outputs">
        {#each Object.keys(module.output) as key}
          <StoreOutput type={module.output[key].type}/>
        {/each}
      </div>
    </div>
  </div>
</div>
</Draggable>

{#if $dragging && (($draggingElement).element === ref)}
  <div> eu sou um modulo, trust me </div>
{/if}

<style lang="scss">
  .items {
    width: 90%;
    display: inline-block;
    float: none;
    position: relative;
    z-index: 2;
  }
  .IO {
    margin: 0 3px 0 3px;
    position: relative;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 1fr 1fr;
    font-size: 60%;
  }
  .inputs {
    grid-column: 1;
    grid-row: 1;
    text-align: left;
  }

  .separator {
    position: absolute;
    width: 2px;
    height: 100%;
    top: 10%;
    left: calc(50% - 1px);
    background-color: #222222;
  }

  .outputs {
    grid-column: 2;
    grid-row: 1;
    text-align: right;
  }
</style>