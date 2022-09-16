<script lang="ts">
  import ArchitectSchemasModulesIcon from "../../../icons/architect/architect-schemas-modules-icon.svelte";
  import ArchitectExternalModulesIcon from "../../../icons/architect/architect-external-modules-icon.svelte";
  import ArchitectInternalModulesIcon from "../../../icons/architect/architect-internal-modules-icon.svelte";
  import Tooltip from "../../common/tooltip.svelte";
  import ArchitectProtocolModulesIcon from "../../../icons/architect/architect-protocol-modules-icon.svelte";
  import ArchitectBopModulesIcon from "../../../icons/architect/architect-bop-modules-icon.svelte";
  import ArchitectConstantsIcon from "../../../icons/architect/architect-constants-icon.svelte";
  import ArchitectVariablesIcon from "../../../icons/architect/architect-variables-icon.svelte";

  type PossibleStores = "internal" | "external" | "schema" | "bops" | "protocols" | "constants" | "variables";
  type TabInfo = { title : string; }
  type TabsInfo = Record<PossibleStores, TabInfo>;

  const tabsInfo : TabsInfo = {
    internal: { title: "Internal Modules" },
    external: { title: "External Modules" },
    schema: { title: "Schema Modules" },
    protocols: { title: "Protocols Modules" },
    bops: { title: "BOps Modules" },
    constants: { title: "Constants" },
    variables: { title: "Variables" },
  };

  let hovered = false;
  export let tab : PossibleStores;
</script>

<div class="w-full h-full flex items-center justify-center stroke-inherit fill-inherit relative"
  on:mouseenter="{() => { hovered = true; }}" on:mouseleave="{() => { hovered = false; }}"
>
  {#if tab === "internal"}
    <ArchitectInternalModulesIcon style="h-4 w-4 stroke-inherit fill-inherit transition-all" />
  {:else if tab === "external"}
    <ArchitectExternalModulesIcon style="h-5 w-5 stroke-inherit fill-inherit transition-all" />
  {:else if tab === "schema"}
    <ArchitectSchemasModulesIcon style="h-5 w-5 stroke-inherit fill-inherit transition-all" />
  {:else if tab === "protocols"}
    <ArchitectProtocolModulesIcon style="h-5 w-5 stroke-inherit fill-inherit transition-all" />
  {:else if tab === "bops"}
    <ArchitectBopModulesIcon style="h-5 w-5 stroke-inherit fill-inherit transition-all" />
  {:else if tab === "constants"}
    <ArchitectConstantsIcon style="h-6 w-6 stroke-inherit fill-inherit transition-all" />
  {:else if tab === "variables"}
    <ArchitectVariablesIcon style="h-5 w-5 stroke-inherit fill-inherit transition-all" />
  {/if}
  <Tooltip tooltipContent={tabsInfo[tab].title} position="left" visible={hovered}/>
</div>
