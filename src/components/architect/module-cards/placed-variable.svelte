<script lang="ts">
  import type { UIBusinessOperation } from "../../../entities/business-operation";
  import { getContext } from "svelte";
  import Typedot from "../../common/typedot.svelte";
  import { typeColors } from "../../../common/styles/type-colors";
  import type { ArchitectContext } from "../../../entities/auxiliary-entities/architect-context";
  import type { ModuleCard } from "../../../common/types/module-card";

  const currentBop = getContext<UIBusinessOperation>("currentBop");
  const context = getContext<ArchitectContext>("architectContext");
  const moduleConfig = getContext<ModuleCard>("moduleConfig");
  const { currentMode } = context;
  const { variables } = currentBop;
  export let constantName = "";
  export let path = "___";
  
  let isOverElement = false;

  $: variableData = $variables.find((value) => value.name === constantName);
  $: valueDisplay = typeof variableData?.initialValue === "object" ? "object" : variableData?.initialValue.toString();
  $: color = typeColors[variableData?.type];
  $: isCutting = $currentMode && context.isCutting;
  $: opacity = isCutting && isOverElement ? "opacity-25" : "opacity-0";
  $: interactible = isCutting ? "" : "pointer-events-none";

  const toggleIsOver = () : void => {
    isOverElement = !isOverElement;
  };

  const removeConnection = () : void => {
    if (!(isOverElement && isCutting)) {
      return;
    }

    const index = moduleConfig.getConflictingDependencyIndex(path);
    if (index >= 0) {
      moduleConfig.dependencies.update((deps) => {
        deps.splice(index, 1);
        return deps;
      });
    }
  };
</script>

<div style="background-color: {color};" class="absolute h-[3px] w-[0.75rem] top-[50%] -translate-y-[50%] left-0 -translate-x-[calc(100%_+_0.125rem)]"/>

<div class="absolute h-[calc(100%_+_0.25rem)] bg-norbalt-500 shadow text-center pr-1 pl-2 rounded-r {interactible} text-xs  top-[50%] -translate-y-[50%] left-0 -translate-x-[calc(100%_+_0.5rem)] flex flex-row items-center overflow-visible"
  on:mouseenter={toggleIsOver}
  on:mouseleave={toggleIsOver}
  on:click={removeConnection}
>
  <div class="mr-1.5 -ml-2c z-10">
    <Typedot size={2} type={{ type: variableData?.type ?? "string" }}/>
  </div>
  <div class="mr-1 whitespace-nowrap">
    {constantName}
  </div>
  <div class="w-[2px] h-[60%] bg-norbalt-100 rounded mr-1"/>
  <div style="color: {color};">
    { valueDisplay }
  </div>
  <div class="h-full w-5 rounded-full absolute left-0 -translate-x-[50%] bg-norbalt-500"/>
  <div class="bg-roseRed {opacity} absolute top-0 left-0 w-full h-full rounded z-0" />
</div>