<script lang="ts">
import { navigation } from "../../lib/navigation";

// Logo on the left
// After the logo, Breadcrumbs
// Right sandwich menu

import { selectedService } from "../../stores/layout-tabs-store";

</script>

<div class="w-full h-14 fixed bg-norbalt-400">
  <div class="h-full flex flex-row flex-nowrap justify-center items-center" on:click="{() => { navigation.navigateTo('/'); selectedService.set(""); }}" >
    <div class="mr-auto flex flex-row justify-center items-center">
      <div class="w-24 flex justify-center items-center mr-auto">
        <img src="/logo-sm.svg" alt="mapikit-logo" class="cursor-pointer -mt-1"/>
      </div>
      <div class="bg-norbalt-200 h-9 w-1 rounded"></div>
    </div>
  </div>
</div>
