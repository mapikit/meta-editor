<script lang="ts">
  import { Archive, ArchiveBox, ArchiveTray, CirclesThreePlus, CopySimple, Cube, TreeStructure } from "phosphor-svelte";
  import { ProjectStore } from "../../../entities/stores/projects-store";
  import CardButton from "../../components/buttons/card-button.svelte";

  export let project : ProjectStore;
</script>

<div class="h-9 mt-4 mb-1 px-0.5 pb-0.5 w-full flex flex-row justify-between items-center">
  <div class="flex h-full w-fit">
    <CardButton hoverColor={"green"} class="w-9 h-9">
      <TreeStructure class="w-7 h-7"/>
    </CardButton>
    <CardButton hoverColor={"yellow"} class="ml-4 w-9 h-9">
      <CopySimple class="w-7 h-7"/>
    </CardButton>
  </div>
  <CardButton hoverColor={"red"} class="w-9 h-9">
    <Archive class="w-7 h-7"/>
  </CardButton>
</div>
