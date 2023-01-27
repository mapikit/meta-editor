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
  import type { ConnectionPointSelection } from "../../../stores/knob-selection-type";
  import { ConnectionsManager, sectionsMap } from "../helpers/sections-map";
  import ConnectionPointDragTraces from "./connection-point-drag-traces.svelte";
  import { updateTraces } from "../update-traces";
  import { ModuleConnection } from "../helpers/module-connection";

  export let mode : "input" | "output";
  export let parentPaths : string[] = [];
  let dotDrag : HTMLDivElement;

  let moduleConfig = getContext<ModuleCard>("moduleConfig");
  const { storedDefinition } = moduleConfig;

  const currentBop = getContext<UIBusinessOperation>("currentBop");
  const context = getContext<ArchitectContext>("architectContext");
  let { configuration } = currentBop;
  let { dragging, draggingElement } = context;
  const elementId = ConnectionsManager
    .getIdentifier(moduleConfig.key === -1 ? "input" : moduleConfig.key, parentPaths.join("."), mode);

  let deepOpen = false;
  // If it is a deep type, should be albe to open and select deeper options
  // Is still selectable itself

  onMount(() => {
    sectionsMap.registerConnectionPoint(mode, elementId, dotDrag);
    sectionsMap.refreshConnections($configuration);
    updateTraces();
  });

  onDestroy(() => {
    sectionsMap.unregisterConnectionPoint(mode, elementId);
    sectionsMap.refreshConnections($configuration);
    updateTraces();
  });

  // eslint-disable-next-line max-lines-per-function
  const getTypeDetails = () : TypeDefinition => {
    const partialDefinition = $storedDefinition[mode];
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
  $: containerOrder = mode === "input" ? "flex-row-reverse" : "flex-row";
  $: deepArrowRotate = mode === "input" ? "rotate-180" : "flex-row-reverse";
  $: innerTypePosition = mode === "input" ? "-translate-x-[calc(100%_+_6px)]" : "translate-x-[6px] left-[100%]";
  $: dropAreaAnchoring = mode === "input" ? "right-0" : "left-0";

  let canEditType = ["array", "cloudedObject"].includes(getTypeDetails().type);

  const toggleDeep = (e : MouseEvent) : void => {
    e.stopPropagation();
    deepOpen = !deepOpen;
    sectionsMap.refreshConnections($configuration);
    updateTraces();
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
      let currentStep = updatedDefinition[mode];
      const previousPath = parentPaths.slice(0, parentPaths.length);

      for (let path of previousPath) {
        let complimentaryPathName = currentStep[path].type === "array" ? "data" : "subtype";
        if (previousPath[previousPath.length -1] === path) { continue; }
        currentStep = currentStep[path][complimentaryPathName];
      };

      if (!currentStep[previousPath[previousPath.length -1]][fieldName]) {
        currentStep[previousPath[previousPath.length -1]][fieldName] = {};
      }

      const indexingIfNotArray = isArray ? 0 : 1;
      const nameIfArray = isArray ? "" : "newProperty";
      let type = isArray ? currentStep[previousPath[previousPath.length -1]]["subtype"] : "string";
      let availableKeyName = (Object.keys(currentStep[previousPath[previousPath.length -1]][fieldName])
        .filter((name) => name.includes(nameIfArray)).length + indexingIfNotArray).toString();
      let subtype;

      if (typeof type === "object" && isArray) {
        subtype = type;
        type = "object";
      }

      if (!isArray) {
        availableKeyName = nameIfArray + availableKeyName;
      }

      currentStep[previousPath[previousPath.length -1]][fieldName][availableKeyName]
        = { type, required: false, subtype };

      console.log(updatedDefinition);
      return updatedDefinition;
    });
  };

  $: acceptedTypes = mode === "input" ? ["output", "constant"] : ["input"];

  type DragDataType = {
    type : "input" | "output" | "module" | "functional";
    propertyType : string;
    property : string;
    key : number | "input";
  }

  // eslint-disable-next-line max-lines-per-function
  const makeConnection = (dropped : DragElement<DragDataType>) : void => {
    const thisPoint : ConnectionPointSelection = {
      pointType: mode,
      propertyType: getTypeDetails().type,
      property: parentPaths.join("."),
      element: dotDrag,
      parentKey: moduleConfig.key === -1 ? "input" : moduleConfig.key,
    };
    const droppedPoint : ConnectionPointSelection = {
      pointType: dropped.data.type,
      propertyType: dropped.data.propertyType,
      property: dropped.data.property,
      element: dropped.element,
      parentKey: dropped.data.key === -1 ? "input" : dropped.data.key,
    };
    currentBop.solveConnection(thisPoint, droppedPoint);
  };
</script>

<div class="relative">
  <div class="relative flex {containerOrder} justify-center items-center">
    <Draggable dragElement={dotDrag} dragType="{mode}" dragData="{{ type: mode, propertyType: getTypeDetails().type, property: parentPaths.join("."), key: moduleConfig.key }}">
      <div bind:this={dotDrag} class="w-4 h-4 rounded flex justify-center items-center hover:bg-offWhite bg-transparent transition-all"> <!-- Clickable section -->
        <Typedot size={2} type={getTypeDetails()}/>
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

  <DropArea style="-translate-y-[0.1rem] top-0 absolute h-[calc(100%_+_0.2rem)] w-[calc(100%_+_4rem)] {dropAreaAnchoring} rounded" acceptTypes={acceptedTypes} onDropContent={makeConnection}/>

  {#if deepOpen && isDeep}
    <div class="absolute bg-norbalt-200 shadow rounded {innerTypePosition} py-1 flex flex-col justify-end -top-1 min-w-[3.5rem]">
      {#each deepProperties as property}
        <EditableProperty storedDefinition={storedDefinition} mode={mode} parentPaths={[...parentPaths, property.key]}>
          <svelte:self mode={mode} parentPaths={[...parentPaths, property.key]}/>
        </EditableProperty>
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
  <ConnectionPointDragTraces onGenerate={() => { sectionsMap.activeLinkingOrigin = dotDrag; }}/>
{/if}
