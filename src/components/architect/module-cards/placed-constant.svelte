<script lang="ts">
  import type { UIBusinessOperation } from "../../../entities/business-operation";
  import { getContext } from "svelte";
  import Typedot from "../../../components/common/typedot.svelte";
  import { typeColors } from "../../../common/styles/type-colors";

  const currentBop = getContext<UIBusinessOperation>("currentBop");
  const { constants } = currentBop;
  export let constantName = "";

  $: constantData = $constants.find((value) => value.name === constantName);
  $: valueDisplay = typeof constantData.value === "object" ? "object" : constantData.value.toString();
  $: color = typeColors[constantData?.type];

</script>

<div style="background-color: {color};" class="absolute h-[3px] w-[0.75rem] top-[50%] -translate-y-[50%] left-0 -translate-x-[calc(100%_+_0.125rem)]"/>

<div class="absolute h-[calc(100%_+_0.25rem)] rounded bg-norbalt-400 shadow text-center px-1 text-xs  top-[50%] -translate-y-[50%] left-0 -translate-x-[calc(100%_+_0.5rem)] flex flex-row items-center">
  <div class="mr-1.5">
    <Typedot size={2} type={{ type: constantData?.type ?? "string" }}/>
  </div>
  <div class="mr-1">
    {constantName}
  </div>
  <div class="w-[2px] h-[60%] bg-norbalt-100 rounded mr-1"/>
  <div style="color: {color};">
    { valueDisplay }
  </div>
</div>