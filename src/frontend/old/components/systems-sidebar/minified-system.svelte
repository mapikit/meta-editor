<script lang="ts">
  import { navigation } from "../../lib/navigation";
  import { selectedSystem } from "../../components/systems-sidebar/systems-stores";
  import { onDestroy } from "svelte";
  import { storageManager } from "../../stores/storage-manager";
  import { availableConfigurations } from "../../stores/configuration-store";
  import { get } from "svelte/store";

  export let systemName = "AlgumNome";
  export let systemId = "algum id";

  let selected = false;
  let selectedClass = "";
  let textSelectedClass = "";

  $: selected = $selectedSystem === systemId;
  $: selectedClass = selected ? "border-white" : "border-transparent hover:border-norbalt-100";
  $: textSelectedClass = selected ? "text-white" : "";

  const unsub = navigation.currentPathParamsSubscribable.subscribe((params) => {
    selectedSystem.set(params["systemId"]);
  });

  const navigateToProject = async () : Promise<void> => {
    await storageManager.manager.appendVersionsToStores(systemId);

    // TODO : Set the rule for knowing the best configuration to select
    // Probably should be the latest edited, but this information is not yet updated on the BE
    const bestConfigId = $availableConfigurations.filter((config) => get(config.projectId) === systemId)[0].id;
    navigation.navigateTo(`/editor/system/${systemId}/configuration/${get(bestConfigId)}`);
  };

  onDestroy(unsub);
</script>

<div class="rounded-md bg-norbalt-200 w-14 h-14 {selectedClass} flex justify-center transition-all relative
  items-center mt-4 first:mt-0 shadow-light border-[3px] text-offWhite text-lg select-none cursor-pointer overflow-hidden"
  on:click="{navigateToProject}"
>
  <div class="text-center {textSelectedClass}">
    <span> {systemName.slice(0,3)} </span>
  </div>
  {#if selected}
    <div class="absolute bottom-0 h-2 bg-white w-1/2 rounded-t-sm translate-y-1">
    </div>
  {/if}
</div>
