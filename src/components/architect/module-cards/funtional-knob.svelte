<script lang="ts">
  import type { BopsConfigurationEntry, Dependency } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import type { Writable } from "svelte/store";
  import type { ModuleCard } from "../../../common/types/module-card";
  import { selectedNob } from "../../../stores/connection-stores";
  import { sectionsMap, SectionsMap } from "../helpers/sections-map";
  import { solveConnection } from "../helpers/solve-connection";
  import DraggableList from "./draggable-list.svelte";

  export let parentKey : number;
  export let bopModules : Writable<ModuleCard[]>;
  let expanded = false;

  const knobIdentifier = SectionsMap.getIdentifier(parentKey, undefined);

  // const handleClick = (event : MouseEvent) => {
  //   event.stopPropagation();
  //   connecting = true;
  //   sectionsMap.activeLinkingOrigin = sectionsMap[nobType][knobIdentifier];
  //   selectedNob.set({
  //     parentKey,
  //     nob: sectionsMap[nobType][knobIdentifier],
  //     property: propertyPath,
  //     nobType,
  //     propertyType: info.type
  //   });
  // }

  // function handleConnectionDrag (event : MouseEvent) : void {
  //   if(connecting) {
  //     updateTraces({ cursor: event });
  //   }
  // }

  function setAsHovered () {
    const found = sectionsMap.hoveredFunctionalKnob.find(id => id === knobIdentifier)
    if(found === undefined) sectionsMap.hoveredFunctionalKnob.push(knobIdentifier);
    bopModules.update(bop => bop);
  }

  function unsetAsHovered () {
    if(!expanded) {
      const index = sectionsMap.hoveredFunctionalKnob.findIndex(id => id === knobIdentifier)
      sectionsMap.hoveredFunctionalKnob.splice(index, 1);
      bopModules.update(bop => bop);
    }
  }

  function expandNob () {
    expanded = !expanded
  }

  function attemptConnection () {
    solveConnection({
      parentKey,
      nob: sectionsMap["functional"][knobIdentifier],
      property: undefined,
      nobType: "functional",
      propertyType: undefined
    }, bopModules);
    selectedNob.set(undefined);
    sectionsMap.refreshConnections($bopModules);
  }

  let parentModule : ModuleCard = {} as ModuleCard;
  $: parentModule = $bopModules.find(module => module.key === parentKey);
  let functionalDeps : Array<Dependency> = [];
  $: functionalDeps = parentModule.dependencies.filter(dependency => dependency.originPath === undefined && dependency.targetPath === undefined)

  function updateDependencyOrder () : void {

  }
  
</script>

<div class="total" 
  bind:this={sectionsMap.functional[knobIdentifier]}
  on:mouseenter={setAsHovered}
  on:mouseleave={unsetAsHovered}
  on:mouseup={attemptConnection}
  on:click={expandNob}
><span class="knob">
    F
  </span>
  <!-- !REMEMBER! Remove this false when implementing -->
  {#if expanded}
    <div class="dependencies">
      <DraggableList parentModule={parentModule} bopModules={bopModules}/>
      <!-- {#each functionalDeps as dependency}
        {$bopModules.find(module => module.key === dependency.origin).moduleName} @{dependency.origin} <br>
      {/each} -->
    </div>
  {/if}
</div>

<style lang="scss">
  .dependencies {
    position: absolute;
    padding: 4px;
    top: 0;
    transform: translateY(calc(-100% - 8px));
    text-align: left;
    background-color: gray;
    border-radius: 8px;
  }
  .text {
    cursor: default;
    margin: 2px 0px 0 0px;
    padding: 0 7px 3px 3px;
    border-radius: 0 5px 5px 0;
    white-space: nowrap;
  }

  .total {
    position: relative;
    user-select: none;
    width: min-content;
    white-space: nowrap;
  }

  .knob {
    color: black;
    background-color: aqua;
    padding: 0 12px 0 4px;
    border-radius: 8px 20px 20px 0;
  }

  .knob:hover {
    background-color: red;
  }
</style>