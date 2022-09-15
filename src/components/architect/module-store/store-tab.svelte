<script lang="ts">
  import Tooltip from "../../common/tooltip.svelte";

  type PossibleStores = "internal" | "external" | "schema" | "bops" | "protocols" | "constants" | "variables";
  type TabInfo = { iconURI : string; title : string; }
  type TabsInfo = Record<PossibleStores, TabInfo>;

  const tabsInfo : TabsInfo = {
    internal: { iconURI: "internal_modules_v1.png", title: "Internal Modules" },
    external: { iconURI: "external_modules_v1.png", title: "External Modules" },
    schema: { iconURI: "schemaFunctions_v1.png", title: "Schema Modules" },
    protocols: { iconURI: "Protocols_v1.png", title: "Protocols Modules" },
    bops: { iconURI: "businessOperations_v1.png", title: "BOps Modules" },
    constants: { iconURI: "constants_v1.png", title: "Constants" },
    variables: { iconURI: "variables_v1.png", title: "Variables" },
  };


  export let ref : HTMLDivElement;
  export let tooltip : string;
  let clientWidth : number;
</script>

<div bind:this={ref} class="tab" bind:clientWidth style="height: {clientWidth}px;">
  <div class="icon" >
    <slot></slot>
  </div>
  <Tooltip  tooltipContent={tooltip}/>
</div>
