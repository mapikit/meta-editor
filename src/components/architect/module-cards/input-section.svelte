<script lang="ts">
  import type { TypeDefinition } from "@meta-system/object-definition";
  import type { BopsConstant } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import type { Writable } from "svelte/store";
  import type { ModuleCard } from "../../../common/types/module-card";
  import { getStoredDefinition } from "../helpers/get-stored-subtype";
  import ConnectionKnob from "./connection-knob.svelte";

  export let name : string;
  export let parentKey : number;
  export let info : TypeDefinition<{}>;
  export let bopModules : Writable<ModuleCard[]>;
  export let bopConstants : Writable<BopsConstant[]>;
  export let path = "";

  let toggleEdition = () => {};

  const fullPath = path ? `${path}.${name}` : name;


  let currentInfo : TypeDefinition;
  $: currentInfo = info.type === "cloudedObject" ? getStoredDefinition($bopModules, parentKey, fullPath, "input") : info;

  const isClouded = info.type === "cloudedObject";
</script>

<div class="total">
  <ConnectionKnob
    bopModules={bopModules}
    bind:info={currentInfo}
    parentKey={parentKey}
    fullPathName={path ? `${path}.${name}` : name}
    nobType="input"
    bind:toggleEdition
    bopsConstants={bopConstants}
    let:item
    ><span class="text" slot="left">
      {name}{#if isClouded}<input type="button" value="E" style="margin-left: 5px;" on:click={toggleEdition}/>{/if}
    </span>
    <svelte:self
      name={item.name}
      info={item.info}
      parentKey={parentKey}
      path={item.fullPathName}
      bopModules={bopModules}
      bopConstants={bopConstants}
    />
  </ConnectionKnob>
</div>

<style lang="scss">
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
    white-space: nowrap;
  }
</style>