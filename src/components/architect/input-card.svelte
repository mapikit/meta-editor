<script lang="ts">
  import PencilIcon from "../../icons/pencil-icon.svelte";
  import { writable } from "svelte/store";
  import type { ModuleCard } from "../../common/types/module-card";
  import MovableCard from "./helpers/movable-card.svelte";
  import CardProperty from "./module-cards/card-property.svelte";
  import ObjectDefinitionMiniApp from "../object-definition/object-definition-mini-app.svelte";
  import { EditorLevel, EditorLevels } from "../object-definition/obj-def-editor-types-and-helpers";
  import { getContext } from "svelte";
  import type { UIBusinessOperation } from "../../entities/business-operation";

  export let configuration : ModuleCard;
  const storedDefinition = configuration.storedDefinition;
  const formatStore = writable($storedDefinition.output ?? {});

  $: outputValues = Object.keys($storedDefinition.output ?? {});

  // let paths = [];
  // let getPathsNames : () => string[];
  // let navigateBackToLevel : (index : number) => void;
  // let getDefinitionAndData : () => { definition : ObjectDefinition, data : object };
  let editing = false;

  function startEditing () : void {
    editing = true;
  }

  // eslint-disable-next-line max-lines-per-function
  function finishEdition () {
    editing = false;

    // configuration.update(input => {
    //   navigateBackToLevel(0);
    //   input.definition = getDefinitionAndData().definition["root"]["subtype"] as ObjectDefinition;

    //   return input;
    // });
  }

</script>

<MovableCard moduleConfig={configuration}>
  <div>
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
          {#if outputValues.length === 0}
            <p class="text-center text-offWhite"> No properties </p>
          {/if}
          <div class="pl-6 flex flex-col items-end">
            {#each outputValues as key}
            <CardProperty mode="output" name={key}/>
            {/each}
          </div>
        </div>
      </div>
    {:else}
      <div class="select-none min-w-[120px] bg-ochreYellow-light rounded shadow p-0.5">
        <ObjectDefinitionMiniApp
          rootStyle="rounded bg-norbalt-350 p-2"
          editingLevel={new EditorLevel(EditorLevels.createDefinition)}
          format={formatStore}
          initialData={{}}
        />
      </div>
    {/if}
  </div>
</MovableCard>
