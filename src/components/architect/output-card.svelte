<script lang="ts">
  import PencilIcon from "../../icons/pencil-icon.svelte";
  import { writable } from "svelte/store";
  import type { ModuleCard } from "../../common/types/module-card";
  import MovableCard from "./helpers/movable-card.svelte";
  import CardProperty from "./module-cards/card-property.svelte";
  import ObjectDefinitionMiniApp from "../object-definition/object-definition-mini-app.svelte";
  import { EditorLevel, EditorLevels } from "../object-definition/obj-def-editor-types-and-helpers";
  import CheckIcon from "../../icons/check-icon.svelte";
  import CancelIcon from "../../icons/cancel-icon.svelte";
  import { getContext, setContext } from "svelte";
  import type { CanvasUtils } from "./canvas-utils";

  export let configuration : ModuleCard;
  const storedDefinition = configuration.storedDefinition;
  const formatStore = writable($storedDefinition.input ?? {});
  let previousValue = {};
  setContext("moduleConfig", configuration);
  const canvasUtils = getContext<CanvasUtils>("canvasContext");

  $: inputValues = Object.keys($storedDefinition.input ?? {});

  let editing = false;

  function startEditing () : void {
    editing = true;
    previousValue = $formatStore;
  }

  // eslint-disable-next-line max-lines-per-function
  function finishEdition () : void {
    editing = false;
    storedDefinition.set({ output: {}, input: $formatStore });
  }

  function cancelEditing () : void {
    formatStore.set(previousValue);
    editing = false;
  }

  const stopPropagation = (e : Event) : void => {
    e.stopPropagation();
  };


</script>

<MovableCard moduleConfig={configuration} onMove={canvasUtils.redrawConnections}>
  <div on:keydown={stopPropagation} on:keyup={stopPropagation}>
    {#if !editing}
      <div class="select-none min-w-[120px] bg-norbalt-350 rounded shadow-light">
        <div class="relative w-full h-8 rounded-t bg-norbalt-200 flex justify-center items-center">
          <div class="h-6 absolute w-6 bg-norbalt-200 rounded left-1 flex justify-center cursor-pointer content-center text-center fill-offWhite hover:fill-white hover:bg-norbalt-100 transition-all"
            on:click={startEditing}
          >
            <PencilIcon style="w-3.5 h-auto fill-inherit"/>
          </div>
          <div class="text-sm text-offWhite px-9"> {configuration.moduleName} </div>
        </div>
        <div class="text-sm text-white pb-3 pt-2">
          {#if inputValues.length === 0}
            <p class="text-center text-offWhite"> No properties </p>
          {/if}
          <div class="pr-6 flex flex-col items-start">
            {#each inputValues as key}
            <CardProperty mode="input" name={key}/>
            {/each}
          </div>
        </div>
      </div>
    {:else}
      <div class="select-none min-w-[120px] bg-ochreYellow-light rounded shadow p-[1px]">
      <div class="select-none min-w-[120px] bg-norbalt-350 rounded shadow-light">
        <div class="relative w-full h-8 rounded-t bg-norbalt-200 flex justify-center items-center">
          <div class="h-6 absolute w-6 bg-norbalt-200 rounded right-1 flex justify-center cursor-pointer content-center text-center stroke-offWhite hover:stroke-brightGreen hover:bg-norbalt-100 transition-all"
            on:click={finishEdition}
          >
            <CheckIcon style="w-3.5 h-auto stroke-inherit"/>
          </div>
          <div class="h-6 absolute w-6 bg-norbalt-200 rounded left-1 flex justify-center cursor-pointer content-center text-center stroke-offWhite hover:stroke-ochreYellow hover:bg-norbalt-100 transition-all"
            on:click={cancelEditing}
          >
            <CancelIcon style="w-3.5 h-auto stroke-inherit"/>
          </div>
          <div class="text-sm text-offWhite px-9"> {configuration.moduleName} </div>
        </div>
          <ObjectDefinitionMiniApp
          rootStyle="rounded bg-norbalt-350 p-2"
          editingLevel={new EditorLevel(EditorLevels.createDefinition)}
          format={formatStore}
          initialData={{}}
          />
        </div>
      </div>
    {/if}
  </div>
</MovableCard>
