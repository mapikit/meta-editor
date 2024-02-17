<script lang="ts">
  import SchemaIcon from "../../icons/schema-icon.svelte";
  import BopIcon from "../../icons/bop-icon.svelte";
  import ProtocolIcon from "../../icons/protocol-icon.svelte";

  export let type : "Schemas" | "Business Operations" | "Protocols" = "Schemas";
  export let iconStyle = "";
</script>

{#if type === "Schemas"}
  <SchemaIcon style={iconStyle}/>
{:else if type === "Business Operations"}
  <BopIcon style={iconStyle}/>
{:else}
  <ProtocolIcon style={iconStyle} />
{/if}
