<script lang="ts">
  import type { TypeDefinition } from "@meta-system/object-definition";
  import type { BopsConstant, Dependency } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import { onMount } from "svelte";
  import type { Writable } from "svelte/store";
  import { typeColors } from "../../../common/styles/type-colors";
  import type { ModuleCard } from "../../../common/types/module-card";
  import { selectedNob } from "../../../stores/connection-stores";
  import { solveConnection } from "../helpers/solve-connection";
  import ConstantTag from "../tags/constant-tag.svelte";


  export let name : string;
  export let parentKey : number;
  export let info : TypeDefinition<{}>;
  export let bopModules : Writable<ModuleCard[]>;
  export let bopConstants : Writable<BopsConstant[]>;

  const parentInfo = $bopModules.find(config => config.key === parentKey);

  let nob : HTMLSpanElement;

  function getNob () : void {
    selectedNob.update((current) => {
      return solveConnection(current, {
        parentKey: parentKey,
        nob,
        property: name,
        nobType: "input",
        propertyType: info.type
      }, bopModules)})
  }
  onMount(() => {
    nob.addEventListener<any & { detail : { constant : BopsConstant }}>("appendTag", (event) => {
      const newDependency = {
        origin: "constants",
        originNob: undefined,
        targetNob: undefined,
        originPath: event.detail.constant.name,
        targetPath: name,
        matchingType: event.detail.constant.type === info.type,
      }
      const existingIndex = parentInfo.dependencies.findIndex(dep => dep.targetPath === name)
      if(existingIndex !== -1) parentInfo.dependencies.splice(existingIndex, 1);
      parentInfo.dependencies.push(newDependency);
      constantConfig = event.detail.constant;
      bopModules.update(modules => modules);
    }, false);

    nob.addEventListener("removeTag", () => {
      const existingIndex = parentInfo.dependencies.findIndex(dep => dep.targetPath === name);
      if(existingIndex !== -1) parentInfo.dependencies.splice(existingIndex, 1);
      constantConfig = undefined;
      bopModules.update(modules => modules);
    }, false);
  });
  

  
  let constantConfig : BopsConstant;
  function getConstant (dependencies : Dependency[]) {
    const thisConfig = dependencies.find(dep => dep.targetPath.startsWith(name));
    if(thisConfig === undefined) return undefined;
    if(typeof thisConfig.origin !== "string" || !["constant", "constants"].includes(thisConfig.origin))
    {return undefined;}
    const constant = $bopConstants.find(cons => cons.name === thisConfig.originPath.split(".")[0]);
    return constant;
  }
  constantConfig = getConstant(parentInfo.dependencies);
</script>

<div class="total" ><span 
  class="nob" id="InputNob"
  style="color: {typeColors[info.type]}" 
  on:click={getNob}
  bind:this={nob}
>●</span><span class="text">{name}</span>
{#if constantConfig !== undefined }
  <ConstantTag config={constantConfig} parentNob={nob}/>
{/if}
</div>

<style lang="scss">
  .nob {
    cursor: default;
    padding: 0 5px 3px 5px;
    margin-left: 0px;
    background-color: #191928;
    transition-duration: 125ms;
  }
  .nob:hover {
    background-color: lightgray;
    transition-duration: 125ms;
  }
  .text {
    cursor: default;
    margin: 2px 0px 0 0px;
    padding: 0 7px 3px 3px;
    border-radius: 0 5px 5px 0;
    background-color: #191928;
    white-space: nowrap;
  }
  .total {
    position: relative;
    user-select: none;
    width: min-content;
    margin: 6px 0 0 0;
  }
</style>