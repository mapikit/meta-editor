<script lang="ts">
  import type { TypeDefinition } from "@meta-system/object-definition";
  import ArrowIcon from "../../../icons/arrow-icon.svelte";
  import Typedot from "../../../components/common/typedot.svelte";
  import CrossIcon from "../../../icons/cross-icon.svelte";
  import { getContext } from "svelte";
  import type { UIBusinessOperation } from "src/entities/business-operation";
  import type { ModuleCard } from "../../../common/types/module-card";
  import EditableProperty from "./editable-property.svelte";
	import clone from "just-clone";

  export let mode : "input" | "output";
  export let parentPaths : string[] = [];

  let moduleConfig = getContext<ModuleCard>("moduleConfig");
  const { storedDefinition } = moduleConfig;

  const currentBop = getContext<UIBusinessOperation>("currentBop");
  let { configuration } = currentBop;

  let deepOpen = false;
  // If it is a deep type, should be albe to open and select deeper options
  // Is still selectable itself

  const getTypeDetails = () : TypeDefinition => {
    const partialDefinition = $storedDefinition[mode];
    const previousPath = parentPaths.slice(0, parentPaths.length);

    let tempData = partialDefinition;
    for (let path of previousPath) {
      if (previousPath[previousPath.length -1] === path) { continue; }

      tempData = tempData[path]["subtype"];
    }

    return tempData[previousPath[parentPaths.length -1]];
  };

  $: isDeep = ["array", "object", "cloudedObject"].includes(getTypeDetails().type);
  $: containerOrder = mode === "input" ? "flex-row-reverse" : "flex-row";
  $: deepArrowRotate = mode === "input" ? "rotate-180" : "flex-row-reverse";
  $: innerTypePosition = mode === "input" ? "-translate-x-[calc(100%_+_6px)]" : "translate-x-[6px] left-[100%]";

  let canEditType = ["array", "cloudedObject"].includes(getTypeDetails().type);

  const toggleDeep = (e : MouseEvent) : void => {
    e.stopPropagation();
    deepOpen = !deepOpen;
  };

  const getDeepProperties = () : Array<{key : string; type : TypeDefinition }> => {
    if (getTypeDetails()["type"] === "array") { return []; }

    const keys = Object.keys(getTypeDetails()["subtype"] ?? {});

    let result = [];
    keys.forEach((key : string) => {
      result.push({ key, type: getTypeDetails()["subtype"][key] });
    });

    return result;
  };

  $: deepProperties = deepOpen ? $configuration && $storedDefinition && getDeepProperties() : [];

  // Only for Objects
  // eslint-disable-next-line max-lines-per-function
  const addPropertyAsField = () : void => {
    storedDefinition.update((value) => {
      const updatedDefinition = clone(value);
      let currentStep = updatedDefinition[mode];
      const previousPath = parentPaths.slice(0, parentPaths.length);

      for (let path of previousPath) {
        if (previousPath[previousPath.length -1] === path) { continue; }
        currentStep = currentStep[path]["subtype"];
      };

      if (!currentStep[previousPath[previousPath.length -1]]["subtype"]) {
        currentStep[previousPath[previousPath.length -1]]["subtype"] = {};
      }

      currentStep[previousPath[previousPath.length -1]]["subtype"]["newProperty"] = { type : "string", required: false };

      return updatedDefinition;
    });
  };
</script>

<div class="relative">
  <div class="relative flex {containerOrder} justify-center items-center">
    <div class="w-4 h-4 rounded flex justify-center items-center hover:bg-offWhite bg-transparent transition-all"> <!-- Clickable section -->
      <Typedot size={2} type={getTypeDetails()} />
    </div>

    {#if isDeep}
      <div class="w-3 h-3 flex {deepArrowRotate} cursor-pointer justify-center items-center top-0 transition-all stroke-offWhite hover:stroke-white"
        on:click={toggleDeep}
      >
        <ArrowIcon style="h-1.5 w-1.5 stroke-inherit"/>
      </div>
    {/if}
  </div>

  {#if deepOpen && isDeep}
    <div class="absolute bg-norbalt-200 shadow rounded {innerTypePosition} py-1 flex flex-col justify-end -top-1 min-w-[3.5rem]">
      {#each deepProperties as property}
        <EditableProperty storedDefinition={storedDefinition} mode={mode} parentPaths={[...parentPaths, property.key]}>
          <svelte:self mode={mode} typeDetails={property.type} parentPaths={[...parentPaths, property.key]}/>
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