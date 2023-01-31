<script lang="ts">
  import type { ModuleCard } from "../../../common/types/module-card";
  import MovableCard from "../helpers/movable-card.svelte";
  import type { TypeDefinitionDeep } from "@meta-system/object-definition/dist/src/object-definition-type";
  import type { DeleteModuleEvent } from "../../../common/types/events";
  import CardProperty from "./card-property.svelte";
  import { getContext, setContext } from "svelte";
  import type { CanvasUtils } from "../canvas-utils";

  export let moduleConfig : ModuleCard;
  export let trash : HTMLDivElement;
  let functionalDepsOpen = false;

  const { storedDefinition } = moduleConfig;
  const canvasUtils = getContext<CanvasUtils>("canvasContext");

  setContext("moduleConfig", moduleConfig);
  
  $: cardInfo = $storedDefinition;
  $: inputValues = Object.keys($storedDefinition.input);
  $: outputValues = Object.keys($storedDefinition.output);

  function attemptDeletion (stopEvent : CustomEvent<MouseEvent>) : void {
    const event = new CustomEvent<DeleteModuleEvent>("deleteModule",
      { detail: { key: moduleConfig.key, mouseEvent: stopEvent.detail } });
    trash.dispatchEvent(event);
  }


  let modularInfo : TypeDefinitionDeep;
  $: modularInfo = {
    type: "object",
    subtype: cardInfo.output,
  };
</script>


{#if cardInfo !== undefined}
  <MovableCard moduleConfig={moduleConfig} on:movementStopped={attemptDeletion} onMove={canvasUtils.redrawConnections}>
    <div class="select-none min-w-[120px] bg-norbalt-350 rounded shadow-light">
      <div class="relative w-full h-8 rounded-t bg-norbalt-200 flex justify-center items-center">
        <div class="h-6 absolute w-6 bg-norbalt-200 rounded left-1 text-center text-offWhite hover:bg-norbalt-100 transition-all"> F </div>
        <div class="text-sm text-offWhite px-9"> {moduleConfig.moduleName} </div>
        <div class="h-6 absolute w-6 bg-norbalt-200 rounded right-1 text-center text-offWhite hover:bg-norbalt-100 transition-all"> > </div>
      </div>
      <div class="text-sm text-white pb-3 pt-2">
        <div class="pr-6 flex flex-col items-start">
          {#each inputValues as key}
            <CardProperty mode="input" name={key}/>
          {/each}
        </div>
        <div class="pl-6 pt-2 flex flex-col items-end">
          {#each outputValues as key}
          <CardProperty mode="output" name={key}/>
          {/each}
        </div>
      </div>
    </div>
  </MovableCard>
{:else}
  <MovableCard moduleConfig={moduleConfig}>
    <div class="undefinedModule" slot="content">! UNAVAILABLE MODULE !<br>
      This card has been deleted. This is usually happens when you delete a BOp that was used internally, or an external package that was removed from
      our database for security reasons. 
    </div>
  </MovableCard>
{/if}






<style lang="scss">
  .functionalKnob {
    position: absolute;
    left: 0;
  }

  .IODiv {
    display: grid;
    position: relative;
    align-items: center;
  }
  
  .inputs {
    grid-column: 1;
    padding-right: 6px;
  }

  .undefinedModule {
    background-color: rgb(114, 1, 1);
    padding: 5px 5px 5px 5px;
    max-width: 300px;
    text-align: center;
    z-index: 3;
  }

  // .divider {
  //   position: absolute;
  //   width: 2px;
  //   height: 80%;
  //   left: calc(50% - 1px);
  //   top: 10%;
  //   background-color: #222222;
  // }

  .moduleNob {
    position: absolute;
    right: 0;
    top: -3px;
    text-align: right;
    z-index: 1;
  }

  .outputs {
    text-align: right;
    grid-column: 2;
    padding-left: 6px;
  }
</style>
