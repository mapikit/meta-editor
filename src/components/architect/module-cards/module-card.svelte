<script lang="ts">
  import type { ModuleCard } from "../../../common/types/module-card";
  import MovableCard from "../helpers/movable-card.svelte";
  import type { TypeDefinitionDeep } from "@meta-system/object-definition/dist/src/object-definition-type";
  import type { DeleteModuleEvent } from "../../../common/types/events";
  import CardProperty from "./card-property.svelte";
  import { getContext, onMount, setContext } from "svelte";
  import type { CanvasUtils } from "../canvas-utils";
  import ModularDeps from "./modular-deps.svelte";
  import { ConnectionPointVertex, VertexType } from "../helpers/connection-vertex";
  import { connectionsManager } from "../helpers/connections-manager";
  import type { UIBusinessOperation } from "src/entities/business-operation";
  import Draggable from "../draggable.svelte";
  import type { ArchitectContext, DragElement } from "src/entities/auxiliary-entities/architect-context";
  import ConnectionPointDragTraces from "./connection-point-drag-traces.svelte";
  import { writable } from "svelte/store";
  import FunctionalDeps from "./functional-deps.svelte";
  import DropArea from "../drop-area.svelte";
  import { getDeepStoreObject } from "../helpers/get-deep-store-obj";

  export let moduleConfig : ModuleCard;
  export let trash : HTMLDivElement;
  let modularDepsButton : HTMLDivElement;
  let titleElement : HTMLElement;
  let funcDepsButton : HTMLDivElement;

  const { storedDefinition } = moduleConfig;
  const canvasUtils = getContext<CanvasUtils>("canvasContext");
  const currentBop = getContext<UIBusinessOperation>("currentBop");
  const architectContext = getContext<ArchitectContext>("architectContext");
  const { configuration } = currentBop;
  const { dragging, draggingElement } = architectContext;
  let connectionVertex : ConnectionPointVertex;
  let funcOriginConnectionVertex : ConnectionPointVertex;
  let funcTargetConnectionVertex : ConnectionPointVertex;
  const openSection = writable("output");

  setContext("openSection", openSection);
  setContext("moduleConfig", moduleConfig);

  $: functionalDepsOpen = $openSection === "function";
  $: modularDepsOpen = $openSection === "module";

  const solveConnectionVertex = (path : string, element : HTMLElement, type : VertexType) : ConnectionPointVertex => {
    const moduleKey = moduleConfig.getBopTransformedKey();

    let result = connectionsManager
      .getVertex(ConnectionPointVertex.generateId(type, moduleKey, path));

    if (result === undefined) {
      result = ConnectionPointVertex
        .buildNew("function", path, moduleKey, type, element);

      connectionsManager.registerVertex(result);
    }

    result.element = element;
    connectionsManager.refreshConnections($configuration);
    canvasUtils.redrawConnections();

    return result;
  };


  onMount(() => {
    connectionVertex = solveConnectionVertex("", modularDepsButton, "module");
    funcOriginConnectionVertex = solveConnectionVertex("", modularDepsButton, "functionalOrigin");
    funcTargetConnectionVertex = solveConnectionVertex("", funcDepsButton, "functionalTarget");
  });
  
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

  const connectFunctional = (element : DragElement<ConnectionPointVertex>) : void => {
    currentBop.solveConnection(funcOriginConnectionVertex, element.data);
    connectionsManager.refreshConnections($configuration);
    canvasUtils.redrawConnections();
  };
</script>


{#if cardInfo !== undefined}
  <MovableCard moduleConfig={moduleConfig} on:movementStopped={attemptDeletion} onMove={canvasUtils.redrawConnections}>
    <DropArea acceptTypes={["functional"]} onDropContent={connectFunctional} style="absolute z-10 rounded"/>
    <div class="select-none min-w-[120px] bg-norbalt-350 rounded shadow-light">
      <div class="relative w-full h-8 rounded-t bg-norbalt-200 flex justify-center items-center">
        <div class="h-6 absolute w-6 bg-norbalt-200 rounded left-1 text-center text-offWhite hover:bg-norbalt-100 transition-all"
          on:click={() => { openSection.set(functionalDepsOpen ? "NONE" : "function"); }}
          bind:this={funcDepsButton}
        > F </div>
        <div bind:this={titleElement} class="text-sm text-offWhite px-9"> {moduleConfig.moduleName} </div>
        <Draggable style="h-6 absolute w-6 right-1" dragElement={modularDepsButton} dragType={"output"} dragData={connectionVertex}>
          <div class="h-6 absolute w-6 bg-norbalt-200 rounded text-center text-offWhite hover:bg-norbalt-100 transition-all"
          bind:this={modularDepsButton}
          on:click={() => { openSection.set(modularDepsOpen ? "NONE" : "module");}}
          > > </div>
        </Draggable>
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
      {#if modularDepsOpen}
        <ModularDeps outputValues={outputValues}/>
      {/if}
      {#if functionalDepsOpen}
        <FunctionalDeps/>
      {/if}
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

{#if $dragging && (($draggingElement).element === modularDepsButton)}
  <ConnectionPointDragTraces originVertex={connectionVertex}/>
{/if}
