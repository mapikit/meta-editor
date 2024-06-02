<script lang="ts">
  import MetaSystemIcon from "../../icons/meta-system-icon.svelte";
  import { getTailwindColor } from "../../../common/tailwind-configuration-accessor";
  import HubRecentProjects from "./hub-recent-projects.svelte";

</script>

<div class="pt-24 w-full h-full overflow-y-scroll flex-col bg-global-bg-gradient flex items-center">
  <div class="flex flex-col flex-wrap w-full max-w-[min(72rem,_100%)] px-8 pb-14 self-center">
  <span class="justify-center stroke-2 h-72 pb-10 max-w-full"><MetaSystemIcon color={getTailwindColor("norbalt", 300)}
    width={1.3}/></span>
  <HubRecentProjects />
  <div class="w-full mt-7">
    <div class="text-3xl font-semibold text-white font-[Livvic]">Browse Plugins</div>
    <div class="text-offWhite">
      Coming Soon...
    </div>
  </div>
  </div>
</div>
