<script lang="ts">
  import type { TypeDefinition } from "@meta-system/object-definition";
  import ArrowIcon from "../../../icons/arrow-icon.svelte";
  import Typedot from "../../../components/common/typedot.svelte";
  import CrossIcon from "../../../icons/cross-icon.svelte";
  import { getContext, onDestroy, onMount } from "svelte";
  import type { UIBusinessOperation } from "src/entities/business-operation";
  import type { ModuleCard } from "../../../common/types/module-card";
  import EditableProperty from "./editable-property.svelte";
  import clone from "just-clone";
  import Draggable from "../draggable.svelte";
  import DropArea from "../drop-area.svelte";
  import type { ArchitectContext, DragElement } from "../../../entities/auxiliary-entities/architect-context";
  import { connectionsManager } from "../helpers/connections-manager";
  import ConnectionPointDragTraces from "./connection-point-drag-traces.svelte";
  import { ConnectionPointVertex } from "../helpers/connection-vertex";
  import type { CanvasUtils } from "../canvas-utils";
  import type { Writable } from "svelte/store";
  import type { BopsConstant } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import PlacedConstant from "./placed-constant.svelte";
  import PlacedVariable from "./placed-variable.svelte";
import Tooltip from "../../common/tooltip.svelte";
import PlacedEnv from "./placed-env.svelte";

  export let mode : "input" | "output" | "module";
  export let parentPaths : string[] = [];
  let dotDrag : HTMLDivElement;
  let usedMode = mode === "module" ? "output" : mode;

  let moduleConfig = getContext<ModuleCard>("moduleConfig");
  const { storedDefinition, dependencies } = moduleConfig;

  const currentBop = getContext<UIBusinessOperation>("currentBop");
  const context = getContext<ArchitectContext>("architectContext");
  const canvasUtils = getContext<CanvasUtils>("canvasContext");
  const openSection = getContext<Writable<string>>("openSection");
  let { configuration } = currentBop;
  let { dragging, draggingElement } = context;
  let connectionVertex : ConnectionPointVertex;

  // eslint-disable-next-line max-lines-per-function
  onMount(() => {
    usedMode = mode === "module" ? "output" : mode;
    const moduleKey = moduleConfig.getBopTransformedKey();
    const solvedPath = ConnectionPointVertex.solvePropertyPath($storedDefinition[usedMode], parentPaths);

    connectionVertex = connectionsManager
      .getVertex(ConnectionPointVertex.generateId(mode, moduleKey, solvedPath));

    if (connectionVertex === undefined) {
      connectionVertex = ConnectionPointVertex
        .buildNew(getTypeDetails().type, solvedPath, moduleKey, mode, dotDrag);

      connectionsManager.registerVertex(connectionVertex);
    }

    connectionVertex.element = dotDrag;
    connectionsManager.refreshConnections($configuration);
    canvasUtils.redrawConnections();
  });

  onDestroy(() => {
    connectionVertex.element = undefined;
    connectionsManager.refreshConnections($configuration);
    canvasUtils.redrawConnections();
  });

  // eslint-disable-next-line max-lines-per-function
  const getTypeDetails = () : TypeDefinition => {
    const partialDefinition = $storedDefinition[usedMode];
    const previousPath = parentPaths.slice(0, parentPaths.length -1);

    let tempData = partialDefinition;
    for (let path of previousPath) {
      if (tempData[path]["type"] === "array") {
        tempData = tempData[path]["data"];
        continue;
      }

      tempData = tempData[path]["subtype"];
    }

    return tempData[parentPaths[parentPaths.length -1]];
  };

  $: isDeep = ["array", "object", "cloudedObject"].includes(getTypeDetails().type);
  $: containerOrder = usedMode === "input" ? "flex-row-reverse" : "flex-row";
  $: deepArrowRotate = usedMode === "input" ? "rotate-180" : "flex-row-reverse";
  $: innerTypePosition = usedMode === "input" ? "-translate-x-[calc(100%_+_6px)]" : "translate-x-[6px] left-[100%]";
  $: dropAreaAnchoring = usedMode === "input" ? "right-0" : "left-0";
  $: deepOpen = $openSection !== mode ? false : deepOpen;

  let canEditType = ["array", "cloudedObject"].includes(getTypeDetails().type);

  const toggleDeep = (e : MouseEvent) : void => {
    e.stopPropagation();
    deepOpen = !deepOpen;
    connectionsManager.refreshConnections($configuration);
    canvasUtils.redrawConnections();

    if (deepOpen) { openSection.set(mode); }
  };

  // eslint-disable-next-line max-lines-per-function
  const getDeepProperties = () : Array<{key : string; type : TypeDefinition }> => {
    if (getTypeDetails()["type"] === "array") {
      const keys = Object.keys(getTypeDetails()["data"] ?? []);
      const result = [];
      keys.forEach((item, index) : void => {
        const type = {};
        type[item.toString()] = getTypeDetails()["subtype"];

        result.push({ key: index, type });
      });
  
      return result;
    }

    const keys = Object.keys(getTypeDetails()["subtype"] ?? {});

    let result = [];
    keys.forEach((key : string) => {
      result.push({ key, type: getTypeDetails()["subtype"][key] });
    });

    return result;
  };

  $: deepProperties = deepOpen ? $configuration && $storedDefinition && getDeepProperties() : [];

  // eslint-disable-next-line max-lines-per-function
  const addPropertyAsField = () : void => {
    const isArray = getTypeDetails().type === "array";

    // eslint-disable-next-line max-lines-per-function
    storedDefinition.update((value) => {
      let fieldName = isArray ? "data" : "subtype";

      const updatedDefinition = clone(value);
      let currentStep = updatedDefinition[usedMode];
      const previousPath = parentPaths.slice(0, parentPaths.length);

      for (let path of previousPath) {
        let complimentaryPathName = currentStep[path].type === "array" ? "data" : "subtype";
        if (previousPath[previousPath.length -1] === path) { continue; }
        currentStep = currentStep[path][complimentaryPathName];
      };

      let currentLevelObject = currentStep[previousPath[previousPath.length -1]][fieldName];

      if (!currentLevelObject) {
        currentStep[previousPath[previousPath.length -1]][fieldName] = {};
        currentLevelObject = currentStep[previousPath[previousPath.length -1]][fieldName];
      }

      const indexingIfNotArray = isArray ? 0 : 1;
      const nameIfArray = isArray ? "" : "newProperty";
      let type = isArray ? currentStep[previousPath[previousPath.length -1]]["subtype"] : "string";
      let availableKeyName = "";

      let currentAvailableIndex = indexingIfNotArray;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _key of (Object.keys(currentLevelObject))) {
        const attemptedKey = nameIfArray + currentAvailableIndex;
        if (!currentLevelObject[attemptedKey]) {
          availableKeyName = attemptedKey;
          break;
        }

        currentAvailableIndex ++;
      }

      let subtype;

      if (typeof type === "object" && isArray) {
        subtype = type;
        type = "object";
      }

      currentLevelObject[isArray ? currentAvailableIndex : availableKeyName]
        = { type, required: false, subtype };

      return updatedDefinition;
    });
  };

  $: acceptedTypes = mode === "input" ? ["output", "constant", "variable", "env"] : ["input"];
  $: currentDependency = $dependencies && moduleConfig.getDependencyAtPath(
    ConnectionPointVertex.solvePropertyPath($storedDefinition[usedMode], parentPaths));
  $: isStaticValue = ["constant", "variable", "env"].includes(currentDependency?.origin as string ?? "");
  $: isConstantValue = (currentDependency?.origin as string ?? "") === "constant";
  $: isVariable = (currentDependency?.origin as string ?? "") === "variable";

  // eslint-disable-next-line max-lines-per-function
  const makeConnection = (dropped : DragElement<ConnectionPointVertex | BopsConstant>) : void => {
    if (dropped.type === "constant" || dropped.type === "variable" || dropped.type === "env") {
      return makeConstantConnection(dropped as DragElement<BopsConstant>);
    };

    const vertexDropped = dropped as DragElement<ConnectionPointVertex>;
    currentBop.solveConnection(connectionVertex, vertexDropped.data);
    connectionsManager.refreshConnections($configuration);
    canvasUtils.redrawConnections();
  };

  const makeConstantConnection = (dropped : DragElement<BopsConstant>) : void => {
    const solvedPath = ConnectionPointVertex.solvePropertyPath($storedDefinition[usedMode], parentPaths);

    currentBop.setStaticConnection(moduleConfig.key, solvedPath, dropped.data);
    connectionsManager.refreshConnections($configuration);
    canvasUtils.redrawConnections();
  };

  const typeTooltipSide = mode === "input" ? "left" : "right";
  let typeTooltipVisible = false;
</script>

<div class="relative">
  <div class="relative flex {containerOrder} justify-center items-center">
    <Draggable dragElement={dotDrag} dragType="{usedMode}" dragData="{connectionVertex}">
      <div bind:this={dotDrag} class="w-4 h-4 rounded flex justify-center items-center hover:bg-offWhite bg-transparent transition-all"
        on:mouseenter={() => { typeTooltipVisible = true; }}
        on:mouseleave={() => { typeTooltipVisible = false; }}> <!-- Clickable section -->
        <Typedot size={2} type={getTypeDetails()}/>
        <Tooltip bind:visible={typeTooltipVisible} tooltipContent={"Type: " + getTypeDetails().type} position={typeTooltipSide}/>
      </div>
    </Draggable>

    {#if isDeep}
      <div class="w-3 h-3 flex {deepArrowRotate} cursor-pointer justify-center items-center top-0 transition-all stroke-offWhite hover:stroke-white"
        on:click={toggleDeep}
      >
        <ArrowIcon style="h-1.5 w-1.5 stroke-inherit"/>
      </div>
    {/if}
  </div>

  {#if isStaticValue}
    {#if isConstantValue}
      <PlacedConstant constantName={currentDependency.originPath} path={[...parentPaths].join(".")}/>
    {:else if isVariable}
      <PlacedVariable constantName={currentDependency.originPath} path={[...parentPaths].join(".")}/>
    {:else}
      <PlacedEnv envKey={currentDependency.originPath} path={[...parentPaths].join(".")}/>
    {/if}
  {/if}
  <DropArea style="-translate-y-[0.1rem] top-0 absolute h-[calc(100%_+_0.2rem)] w-[calc(100%_+_4rem)] {dropAreaAnchoring} rounded" acceptTypes={acceptedTypes} onDropContent={makeConnection}/>

  {#if deepOpen && isDeep}
    <div class="absolute bg-norbalt-200 shadow rounded {innerTypePosition} py-1 flex flex-col justify-end -top-1 min-w-[3.5rem]">
      {#each deepProperties as property}
        {#key [...parentPaths, property.key].join("")}
        <EditableProperty storedDefinition={storedDefinition} mode={usedMode} parentPaths={[...parentPaths, property.key]}>
          <svelte:self mode={mode} parentPaths={[...parentPaths, property.key]}/>
        </EditableProperty>
        {/key}
      {/each}
      {#if canEditType}
        <div class="border cursor-pointer rounded border-norbalt-100 hover:border-offWhite stroke-norbalt-100 hover:stroke-offWhite transition-all p-1 mx-1 flex justify-center items-center mt-1.5 first:mt-0"
          on:click={addPropertyAsField}
        >
          <CrossIcon style="stroke-inherit w-1.5 h-1.5 rotate-45"/>
        </div>
      {/if}
    </div>
  {/if}
</div>

{#if $dragging && (($draggingElement).element === dotDrag)}
  <ConnectionPointDragTraces originVertex={connectionVertex}/>
{/if}
