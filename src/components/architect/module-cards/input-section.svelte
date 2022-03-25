<script lang="ts">
  import type { BopsConstant, Dependency } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { onMount } from "svelte";
import { update_await_block_branch } from "svelte/internal";

  import { typeColors } from "../../../common/styles/type-colors";

  import type { ModuleCard } from "../../../common/types/module-card";
  import { bopStore } from "../../../stores/bop-store";
  import { selectedNob } from "../../../stores/connection-stores";
  import { solveConnection } from "../helpers/solve-connection";
  import ConstantTag from "../tags/constant-tag.svelte";


  export let name : string;
  export let parentInfo : ModuleCard;
  let nob : HTMLSpanElement;

  function getNob () : void {
    selectedNob.update((current) => {
      return solveConnection(current, {
        parentKey: parentInfo.key,
        nob,
        property: name,
        nobType: "input",
        propertyType: parentInfo.info.input[name].type,
      },
      );});
  }
  onMount(() => {
    nob.addEventListener<any & { detail : { constant : BopsConstant }}>("appendTag", (event) => {
      const newDependency = {
        origin: "constants",
        originNob: undefined,
        targetNob: undefined,
        originPath: event.detail.constant.name,
        targetPath: name,
        matchingType: event.detail.constant.type === parentInfo.info.input[name].type,
      };
      const existingIndex = parentInfo.dependencies.findIndex(dep => dep.targetPath === name);
      if(existingIndex !== -1) parentInfo.dependencies.splice(existingIndex, 1);
      parentInfo.dependencies.push(newDependency);
      constantConfig = event.detail.constant;
      bopStore.update(bop => bop);
    }, false);

    nob.addEventListener("removeTag", () => {
      const existingIndex = parentInfo.dependencies.findIndex(dep => dep.targetPath === name);
      if(existingIndex !== -1) parentInfo.dependencies.splice(existingIndex, 1);
      constantConfig = undefined;
      bopStore.update(bop => bop);
    }, false);
  });
  

  
  let constantConfig : BopsConstant;
  function getConstant (dependencies : Dependency[]) {
    const thisConfig = dependencies.find(dep => dep.targetPath.startsWith(name));
    if(thisConfig === undefined) return undefined;
    if(typeof thisConfig.origin !== "string" || !["constant", "constants"].includes(thisConfig.origin))
    {return undefined;}
    const constant = $bopStore.constants.find(cons => cons.name === thisConfig.originPath.split(".")[0]);
    return constant;
  }
  constantConfig = getConstant(parentInfo.dependencies);
</script>

<style lang="scss">
  .nob {
    cursor: default;
    padding: 0 5px 3px 5px;
    margin-left: 4px;
    background-color: rgb(94, 93, 93);
    border-radius: 5px 0 0 5px;
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
    background-color: rgb(94, 93, 93);
  }
  .total {
    position: relative;
    user-select: none;
    width: min-content;
    margin: 6px 0 0 0;
  }
</style>

<div class="total" ><span 
    class="nob" id="InputNob"
    style="color: {typeColors[parentInfo.info.input[name].type]}" 
    on:click={getNob}
    bind:this={nob}
  >●</span><span class="text">{name}</span>
  {#if constantConfig !== undefined }
    <ConstantTag config={constantConfig} parentNob={nob}/>
  {/if}
</div>