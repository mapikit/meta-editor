<script lang="ts">
  import type { FunctionDefinition } from "@meta-system/meta-function-helper";
	import { each } from "svelte/internal";
  import InfoIcon from "../../../../static/info-icon.svelte";
  import Tooltip from "../../../components/common/tooltip.svelte";
  export let definition : FunctionDefinition;
  export let tooltipPosition :  "top" | "bottom" | "left" | "right" = "left";
  export let parentSchema = undefined;

  let tooltipVisible = false;

  //SAVE: tooltipContent={definition["description"]}
</script>

<div class="select-none min-w-[120px] bg-norbalt-350 rounded cursor-grab">
  <div class="h-8 bg-norbalt-300 rounded-t flex flex-row items-center justify-between">
    <slot name="functionalDep"/>
    <div class="flex flex-row h-4 ml-1">
      {#each [0,1,2] as num}
        <div class="h-full w-[2px] rounded bg-norbalt-100 ml-1.5"/>
      {/each}
    </div>
    <span class="text-offWhite" >{definition.functionName}</span> {#if parentSchema} <span class="schemaName">@{parentSchema}</span> {/if}
    <div class="tooltipIcon"
      on:focus={undefined}
      on:mouseenter={() => { tooltipVisible = true; } }
      on:mouseleave={() => { tooltipVisible = false; } }
    >

    <Tooltip visible={tooltipVisible} tooltipContent={definition["description"]} position={tooltipPosition}/>
  </div>
    <slot name="moduleNob" ></slot>
  </div>
  <slot name="content"></slot>
</div>

<style lang="scss">
  .schemaName {
    color: rgb(148, 148, 148);
  }

  .tooltipIcon {
    border-radius: 10px;
    display: inline-block;
    position: relative;
    margin: 2px;
    top: 2px;
    left: 4px;
  }
  

  .header {
    font-family: 'Dosis';
    font-size: 20px;
    text-align: center;
    background-color: #10101a;
    border-radius: 5px 5px 0 0 ;
    display: inline-block;
    width: 100%;
    padding-left: 8px;
    padding-right: 8px;
  }

  .modName {
    vertical-align: 1.5px;
  }
</style>