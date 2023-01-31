<script lang="ts">
  import { getAvailableKey } from "../../helpers/get-available-key";
  import StoreInput from "./store-input.svelte";
  import StoreOutput from "./store-output.svelte";
  import type { ModuleType } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import { Coordinate } from "../../../../common/types/geometry";
  import { get, Writable } from "svelte/store";
  import { ModuleCard as ModuleCardType } from "../../../../common/types/module-card";
  import type { StoreModuleInfo } from "../../../../common/types/store-module-info";
  import Tooltip from "../../../../components/common/tooltip.svelte";
  import Draggable from "../../draggable.svelte";
  import type { ArchitectContext } from "../../../../entities/auxiliary-entities/architect-context";
  import { getContext } from "svelte";
  import DraggingModule from "../../module-cards/dragging-module.svelte";
  import type { UIBusinessOperation } from "src/entities/business-operation";
  export let module : StoreModuleInfo;
  export let moduleType : ModuleType;
  export let bopModules : Writable<ModuleCardType[]>;

  const context = getContext<ArchitectContext>("architectContext");
  const currentBop = getContext<UIBusinessOperation>("currentBop");
  let { dragging, draggingElement, scale, originPos } = context;

  let ref : HTMLDivElement;
  let left = 0;
  let top = 0;
  let parentSchema = undefined;
  let tooltipVisible = false;

  function getPackage () : string {
    switch (moduleType) {
      case "schemaFunction": return module.schemaName;
      default: return undefined;
    }
  }

  $: moduleDragData = $bopModules && getModuleDragData();

  const getModuleDragData = () : ModuleCardType => {
    return ModuleCardType.generate({
      key: getAvailableKey($bopModules),
      moduleName: module.functionName,
      modulePackage: getPackage(),
      moduleType: moduleType,
      position: new Coordinate(left, top)
        .moveBy(-$originPos.x, -$originPos.y)
        .scale(1/$scale),
      bopId: get(currentBop.id),
    });
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
  <DraggingModule moduleName={module.functionName}/>
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