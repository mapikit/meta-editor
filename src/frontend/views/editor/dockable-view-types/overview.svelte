<script lang="ts">
	import { SystemConfiguration } from "src/entities/models/system-configuration";
	import { ViewStore } from "src/entities/stores/view-store";

  export let content : ViewStore<SystemConfiguration>;

  let systemData = content.entityViewData;
  let { name, version } = $systemData;
</script>

<div class="justify-center items-center flex flex-col">
  <div class="w-full px-4 flex justify-center items-center flex-col">
    <h1 class="text-3xl font-[Livvic] font-bold">
      {name} <span class="text-offWhite text-lg">@ {version} </span>
    </h1>
    <div class="h-1 bg-norbalt-200 w-full rounded mt-1"/> <!-- Separator-->
  </div>

  <div class="bg-norbalt-300 rounded-md p-3 px-4 outline outline-2 outline-norbalt-200 mt-4 shadow">
    System Summary Here
  </div>
</div>
