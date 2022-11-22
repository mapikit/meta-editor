<script lang="ts">
  import InputSection from "./input-section.svelte";
  import OutputSection from "./output-section.svelte";
  import type { ModuleCard } from "../../../common/types/module-card";
  import { FunctionsInfo } from "../helpers/functions-info";
  import StaticCardBody from "./module-card-skeleton.svelte";
  import { getAvailableKey } from "../helpers/get-available-key";
  import { environment } from "../../../stores/environment";
  import { Coordinate } from "../../../common/types/geometry";
  import MovableCard from "../helpers/movable-card.svelte";
  import type { Writable } from "svelte/store";
  import type { BopsConstant } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import type { TypeDefinitionDeep } from "@meta-system/object-definition/dist/src/object-definition-type";
  import FunctionalKnob from "./functional-knob.svelte";
  import ModularSection from "./modular-section.svelte";
  import type { DeleteModuleEvent } from "../../../common/types/events";
  import CardProperty from "./card-property.svelte";
  import { setContext } from "svelte";

  export let moduleConfig : ModuleCard;
  export let bopModules : Writable<ModuleCard[]>;
  export let bopConstants : Writable<BopsConstant[]>;
  export let trash : HTMLDivElement;
  let functionalDepsOpen = false;

  setContext("moduleConfig", moduleConfig);

  moduleConfig.key = moduleConfig.key ?? getAvailableKey($bopModules);
  moduleConfig.dependencies = moduleConfig.dependencies ?? [];
  moduleConfig.dimensions = moduleConfig.dimensions ?? { height: undefined, width: undefined };
  moduleConfig.position = moduleConfig.position ?? new Coordinate(220*$environment.distributionColumn++, 70);
  moduleConfig.dimensions = moduleConfig.dimensions ?? { height: undefined, width: undefined };
  moduleConfig.position = moduleConfig.position ?? new Coordinate(220*$environment.distributionColumn++, 70);
  $: cardInfo = FunctionsInfo.getCardInfo(moduleConfig);

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
  <MovableCard moduleConfig={moduleConfig} bopModules={bopModules} on:movementStopped={attemptDeletion}>
    <div class="select-none min-w-[120px] bg-norbalt-350 rounded shadow-light">
      <div class="relative w-full h-8 rounded-t bg-norbalt-200 flex justify-center items-center">
        <div class="h-6 absolute w-6 bg-norbalt-200 rounded left-1 text-center text-offWhite hover:bg-norbalt-100 transition-all"> F </div>
        <div class="text-sm text-offWhite px-9"> {moduleConfig.moduleName} </div>
        <div class="h-6 absolute w-6 bg-norbalt-200 rounded right-1 text-center text-offWhite hover:bg-norbalt-100 transition-all"> > </div>
      </div>
      <div class="text-sm text-white pb-3 pt-2">
        <div class="pr-6 flex flex-col items-start">
          {#each Object.keys(cardInfo.input) as key}
            <CardProperty mode="input" keyType={cardInfo.input[key]} name={key}/>
          {/each}
        </div>
        <div class="pl-6 pt-2 flex flex-col items-end">
          {#each Object.keys(cardInfo.output) as key}
          <CardProperty mode="output" keyType={cardInfo.output[key]} name={key}/>
          {/each}
        </div>
      </div>
    </div>
    <!-- <StaticCardBody definition={cardInfo} tooltipPosition="top" slot="content" parentSchema={moduleConfig.moduleType === "schemaFunction" ? moduleConfig.modulePackage : undefined}>
      <span slot="functionalDep" class="functionalKnob">
        <FunctionalKnob
          bopModules={bopModules}
          parentKey={moduleConfig.key}
        />
      </span>
      <span slot="moduleNob" class="moduleNob">
        <ModularSection
          bopModules={bopModules}
          parentKey={moduleConfig.key}
          info={modularInfo}
        />
      </span>
      <div slot="content" class="IODiv">
        <div class="inputs">
          {#each Object.keys(cardInfo.input) as key}
            <InputSection bopModules={bopModules} bind:bopConstants name={key} parentKey={moduleConfig.key} info={cardInfo.input[key]}/>
          {/each}
        </div>
        <div class="outputs">
          {#each Object.keys(cardInfo.output) as key}
            <OutputSection bopModules={bopModules} name={key} parentKey={moduleConfig.key} info={cardInfo.output[key]}/>
          {/each}
        </div>
      </div>
    </StaticCardBody> -->
  </MovableCard>
{:else}
  <MovableCard moduleConfig={moduleConfig} bopModules={bopModules}>
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
