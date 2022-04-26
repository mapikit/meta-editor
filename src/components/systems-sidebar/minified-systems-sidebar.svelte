<script lang="ts">
import MinifiedSystem from "./minified-system.svelte";
const systems = [
  { systemName: "teste 1" },
  { systemName: "CallFromTheDammned" },
  { systemName: "Shipment Request" },
];
</script>

<div class="sidebar">
  {#each systems as system}
    <MinifiedSystem systemName={system.systemName}/>
  {/each}
</div>

<style lang="scss">
  .sidebar {
    width: 86px;
    height: calc(100vh - 48px);
    background-color: #1a1a2a;
    padding: 18px 10px;
    overflow-y: auto;
  }
</style>