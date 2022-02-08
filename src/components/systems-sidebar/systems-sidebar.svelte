<script lang="ts">
import { guideText } from "../../stores/layout-tabs-store";

  import SidebarSystem from "./sidebar-system.svelte";
  import type { SystemData } from "./types";

  const systems : SystemData[] = [
    {
      name: "System Sample",
      description: "Here's some description for you. Not realy useful, but it's there.",
      starred: false,
      version: "0.2.16",
      envsCount: 12,
      schemasCount: 8,
      bopsCount: 25,
      protocolsCount: 2
    },
    {
      name: "Another Sys",
      description: "This was made to ensure we have some good text trying to display on the tabs. This will be longer to test out if the thing actually supports the crazy kind of users.",
      starred: true,
      version: "3.0.1",
      envsCount: 2,
      schemasCount: 4,
      bopsCount: 32,
      protocolsCount: 1
    },
    {
      name: "Custom Create",
      description: "Sane and short description, like it should be.",
      starred: true,
      version: "12.1.201",
      envsCount: 31,
      schemasCount: 19,
      bopsCount: 325,
      protocolsCount: 5
    }
  ]

  guideText.set("Select or create a system to work with.")
</script>

<div class="sidebar">
 {#each systems as system}
  <SidebarSystem system="{system}" />
 {/each}
</div>

<style lang="scss">

.sidebar {
  width: 460px;
  background-color: #1a1a2a;
  padding: 18px 38px;
}

</style>
