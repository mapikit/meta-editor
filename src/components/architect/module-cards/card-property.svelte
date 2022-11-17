<script lang="ts">
  import type { TypeDefinition } from "@meta-system/object-definition";
  import ConnectionPoint from "./connection-point.svelte";

  export let mode : "input" | "output";
  // eslint-disable-next-line @typescript-eslint/ban-types
  export let keyType : TypeDefinition<{}>;
  export let name : string;

  $: positionFloat = mode === "input" ? "flex-row" : "flex-row-reverse";
  $: roundedSide = mode === "input" ? "rounded-r pr-2" : "rounded-l pl-2";
</script>

<div class="flex {positionFloat} {roundedSide} justify-center items-center px-0.5 py-0.5 bg-norbalt-200 mt-1.5 first:mt-0">
  <ConnectionPoint mode={mode} typeDetails={keyType}/>
  <div class="w-1"/>
  <div class="text-xs">
    {name}
  </div>
</div>