<script lang="ts">
  import BopIcon from "../../icons/bop-icon.svelte";

  export let type : "Schema" | "Business Operations" | "Protocols" = "Schema"
  export let iconStyle = "";
</script>

{#if type === "Schema"}

{:else if type === "Business Operations"}
  <BopIcon />
{:else}

{/if}
