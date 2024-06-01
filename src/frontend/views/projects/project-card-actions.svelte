<script lang="ts">
  import { ArchiveBox, CirclesThreePlus, Cube, PencilLine } from "phosphor-svelte";
  import { ProjectStore } from "../../../entities/stores/projects-store";
  import CardIconButton from "../../components/buttons/card-icon-button.svelte";

  export let project : ProjectStore;
</script>

<div class="h-9 mt-4 mb-1 px-0.5 pb-0.5 w-full flex flex-row justify-between items-center">
  <div class="flex h-full w-fit">
    <CardIconButton hoverColor={"green"} class="w-9 h-9">
      <Cube class="w-7 h-7"/>
    </CardIconButton>
    <CardIconButton hoverColor={"yellow"} class="ml-4 w-9 h-9">
      <CirclesThreePlus class="w-7 h-7"/>
    </CardIconButton>
  </div>
  <CardIconButton hoverColor={"red"} class="w-9 h-9">
    <ArchiveBox class="w-7 h-7"/>
  </CardIconButton>
</div>
