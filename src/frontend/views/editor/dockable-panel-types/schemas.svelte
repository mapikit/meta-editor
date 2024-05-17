<script lang="ts">
  import { SystemConfiguration } from "../../../../entities/models/system-configuration";
  import { PanelsStore } from "../../../../entities/stores/panels-store";

  export let content : PanelsStore<{identifier : string, value : SystemConfiguration["schemas"] }>;
  let systemData = content.entityPanelData;
</script>

<div>
<!-- {($systemData.value.length).toString()} -->
  {#each $systemData.value as schema }
    <p> {schema.name} </p>
  {/each}
  <div class="w-full p-1">

  </div>
</div>
