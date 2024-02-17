<script lang="ts">
  import { getContext } from "svelte";
  import Typedot from "../../common/typedot.svelte";
  import { typeColors } from "../../../common/styles/type-colors";
  import type { ArchitectContext } from "../../../entities/auxiliary-entities/architect-context";
  import type { ModuleCard } from "../../../common/types/module-card";
  import Tooltip from "../../../components/common/tooltip.svelte";
import { currentConfig } from "../../../stores/configuration-store";
import { get } from "svelte/store";

  const context = getContext<ArchitectContext>("architectContext");
  const moduleConfig = getContext<ModuleCard>("moduleConfig");
  const config = $currentConfig;
  const { currentMode } = context;
  const { envs } = config;
  export let envKey = "";
  export let path = "___";
  
  let isOverElement = false;

  $: envData = $envs.find((value) => get(value.key) === envKey);
  $: valueDisplay = typeof get(envData?.value) === "object" ? "object" : get(envData?.value).toString();
  $: color = typeColors.string;
  $: isCutting = $currentMode && context.isCutting;
  $: opacity = isCutting && isOverElement ? "opacity-25" : "opacity-0";

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

<div class="absolute h-[calc(100%_+_0.25rem)] bg-norbalt-500 text-center pr-1 pl-2 rounded shadow-[0_0_0_1px_rgba(60,255,136,0.4)] text-xs  top-[50%] -translate-y-[50%] left-0 -translate-x-[calc(100%_+_0.5rem)] flex flex-row items-center overflow-visible"
  on:mouseenter={toggleIsOver}
  on:mouseleave={toggleIsOver}
  on:click={removeConnection}
>

  <Tooltip visible={isOverElement} tooltipContent={`Env (string): ${valueDisplay}`} position="top"/>
  <div class="mr-1.5 -ml-2c z-10">
    <Typedot size={2} type={{ type: "string" }}/>
  </div>
  <div class="mr-1 whitespace-nowrap">
    {envKey}
  </div>
  <div class="w-[2px] h-[60%] bg-norbalt-100 rounded mr-1"/>
  <div style="color: {color};" class="truncate max-w-[15ch]">
    { valueDisplay }
  </div>
  
  <div class="bg-roseRed {opacity} absolute top-0 left-0 w-full h-full rounded z-0" />
</div>