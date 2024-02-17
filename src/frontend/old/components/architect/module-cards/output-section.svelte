<script lang="ts">
  import type { TypeDefinition } from "@meta-system/object-definition";
  import type { Writable } from "svelte/store";
  import type { ModuleCard } from "../../../common/types/module-card";
  import ConnectionKnob from "./connection-knob.svelte";
  import { getStoredDefinition } from "../helpers/get-stored-subtype";

  export let name : string;
  export let info : TypeDefinition<{}>;
  export let parentKey : number | "input";
  export let path = "";
  export let bopModules : Writable<ModuleCard[]>;

  const fullPath = path ? `${path}.${name}` : name

  let currentInfo : TypeDefinition;
  $: currentInfo = info.type === "cloudedObject" ? getStoredDefinition($bopModules, Number(parentKey), fullPath, "output") : info

  let toggleEdition = () => {}

  const isClouded = info.type === "cloudedObject";

</script>

<div class="total">
  <ConnectionKnob
    bopModules={bopModules}
    bind:info={currentInfo}
    bind:parentKey
    fullPathName={path ? `${path}.${name}` : name}
    nobType="output"
    bind:toggleEdition
    let:item
  ><span class="text" slot="right">
      {#if isClouded}<input type="button" value="E" style="margin-right: 5px;" on:click={toggleEdition}/>{/if}{name}
    </span>
    <svelte:self
      name={item.name}
      info={item.info}
      parentKey={parentKey}
      path={item.fullPathName}
      bopModules={bopModules}
    />
  </ConnectionKnob>
</div>

<style lang="scss">
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
    text-align: right;
    user-select: none;
    margin: 7px 0px 0px auto;
    width: max-content;
  }
</style>

