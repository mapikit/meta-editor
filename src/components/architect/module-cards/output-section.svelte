<script lang="ts">
  import { selectedNob } from "../../../stores/connection-stores";
  import { solveConnection } from "../helpers/solve-connection";
  import { typeColors } from "../../../common/styles/type-colors";
  import type { ObjectDefinition, TypeDefinition } from "@meta-system/object-definition";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import type { Writable } from "svelte/store";
  import type { ModuleCard } from "../../../common/types/module-card";
  import { SectionsMap, sectionsMap } from "../helpers/sections-map";
  import { EditorLevel, EditorLevels } from "../../object-definition/obj-def-editor-types-and-helpers";
  import ObjectDefinitionMiniApp from "../../object-definition/object-definition-mini-app.svelte";

  const dispatch = createEventDispatcher();
  onMount(() => dispatch("mountUnmount"))
  onDestroy(() => dispatch("mountUnmount"))

  export let name : string;

  export let info : TypeDefinition<{}>;
  export let parentKey : number | "input";
  export let path = "";
  export let bopModules : Writable<ModuleCard[]>;

  let getPathsNames : () => string[];
  let navigateBackToLevel : (index : number) => void;
  let getDefinitionAndData : () => { definition: ObjectDefinition, data : object };

  let expanded = false;
  let editing = false;
  const isObject = info.type === "object";
  const isClouded = info.type === "cloudedObject";
  if(isClouded && info["subtype"] === undefined) info["subtype"] = {}


  const handleClick = isObject || isClouded ? toggleExpansion : getNob;

  function getNob () : void {
    selectedNob.update((current) => {
      return solveConnection(current, {
      parentKey,
      nob: sectionsMap.outputs[SectionsMap.getIdentifier(parentKey, `result.${path ? `${path}.${name}` : name}`)],
      property: path ? `${path}.${name}` : name,
      nobType: "output",
      propertyType: info.type
    }, bopModules)})
  }

  function toggleEdition () {
    expanded = false;
    if(editing) {
      info["subtype"] = getDefinitionAndData().definition["root"]["subtype"]
    }
    
    editing = !editing;

  }


  function toggleExpansion () {
    expanded = !expanded
  }

  function expandObject() : void {
    setTimeout(() => bopModules.update(mod => mod), 1);
  }
</script>

<div class="total">
  <span class="text">{#if isClouded}<input type="button" value="E" style="margin-right: 5px;" on:click={toggleEdition}/>{/if}{name}</span><span 
  class="nob"
  style="color: {typeColors[info.type]};"
  on:click={handleClick}
  bind:this={sectionsMap.outputs[SectionsMap.getIdentifier(parentKey, `result.${path ? `${path}.${name}` : name}`)]}>{ isObject || isClouded ? ( expanded ? "▼" : "⯈") : "●" }</span>
  {#if editing}
    <ObjectDefinitionMiniApp
      editingLevel={new EditorLevel(EditorLevels.createDefinition)} 
      initialDefinition={info["subtype"]} initialData={{}}
      bind:getPathsNames
      bind:navigateBackToLevel
      bind:getDefinitionAndData
    />
  {/if}
  {#if expanded}
    {#each Object.keys(info["subtype"]) as output}
      <svelte:self
        on:mountUnmount={expandObject}
        path={name}
        name={output}
        info={info["subtype"][output]}
        parentKey={parentKey}
      />
    {/each}
  {/if}
</div>

<style lang="scss">
  .nob {
    cursor: default;
    padding: 0 5px 3px 2px;
    background-color: #191928;
    transition-duration: 125ms;
  }

  .nob:hover {
    background-color: lightgray;
    transition-duration: 125ms;
  }

  .text {
    user-select: none;
    cursor: default;
    margin: 0 0 15px 0;
    padding: 0 2px 3px 7px;
    border-radius: 5px 0 0 5px;
    background-color: #191928;
    white-space: nowrap;
  }

  .total {
    user-select: none;
    margin: 7px 0px 0px auto;
    width: max-content;
  }
</style>

