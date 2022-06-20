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
  import ConnectionKnob from "./connection-knob.svelte";
  import type { TypeDefinitionDeep } from "@meta-system/object-definition/dist/src/object-definition-type";
import ModularSection from "./modular-section.svelte";

  export let moduleConfig : ModuleCard;
  export let bopModules : Writable<ModuleCard[]>
  export let bopConstants : Writable<BopsConstant[]>;
  moduleConfig.key = moduleConfig.key ?? getAvailableKey($bopModules);
  moduleConfig.dependencies = moduleConfig.dependencies ?? [];
  moduleConfig.dimensions = moduleConfig.dimensions ?? { height: undefined, width: undefined };
  moduleConfig.position = moduleConfig.position ?? new Coordinate(220*$environment.distributionColumn++, 70 );
  moduleConfig.dimensions = moduleConfig.dimensions ?? { height: undefined, width: undefined };
  moduleConfig.position = moduleConfig.position ?? new Coordinate(220*$environment.distributionColumn++, 70 );
  $: cardInfo = FunctionsInfo.getCardInfo(moduleConfig);
  export let trashPosition : DOMRect;

  function checkRectCollision(x : number, y : number, targetRect : DOMRect) : boolean {
    return (x > targetRect.x && x < targetRect.x + targetRect.width) &&
      (y > targetRect.y && y < targetRect.y + targetRect.height);
  }

  function checkDeletion (event : MouseEvent) : void {
    if(checkRectCollision(event.x, event.y, trashPosition)) deleteCard()
  }

  function deleteCard () {
    bopModules.update(modules => {
      // Remove Dependants
      modules.forEach(module => {
        for(let i = module.dependencies.length-1; i >= 0; i--) {
          if(module.dependencies[i].origin === moduleConfig.key)
          {module.dependencies.splice(i, 1);}
        }
      });

      const index = $bopModules.findIndex(module => module.key === moduleConfig.key);
      modules.splice(index, 1);

      return modules;
    });
  }

  let modularInfo : TypeDefinitionDeep;
  $: modularInfo = {
    type: "object",
    subtype: cardInfo.output
  }
</script>


{#if cardInfo !== undefined}
  <MovableCard moduleConfig={moduleConfig} stopMovementCallback={checkDeletion} bopModules={bopModules}>
    <StaticCardBody definition={cardInfo} tooltipPosition="top" slot="content" parentSchema={moduleConfig.moduleType === "schemaFunction" ? moduleConfig.modulePackage : undefined}>
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
    </StaticCardBody>
  </MovableCard>
{:else}
  <MovableCard moduleConfig={moduleConfig} stopMovementCallback={checkDeletion} bopModules={bopModules}>
    <div class="undefinedModule" slot="content">! UNAVAILABLE MODULE !<br>
      This card has been deleted. This is usually happens when you delete a BOp that was used internally, or an external package that was removed from
      our database for security reasons. 
    </div>
  </MovableCard>
{/if}






<style lang="scss">
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
    background-color: darkred;
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
