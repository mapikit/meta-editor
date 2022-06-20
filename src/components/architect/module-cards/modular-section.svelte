<script lang="ts">
  import type { TypeDefinition } from "@meta-system/object-definition";
  import type { Writable } from "svelte/store";
  import type { ModuleCard } from "../../../common/types/module-card";
  import ConnectionKnob from "./connection-knob.svelte";
  import { getStoredDefinition } from "../helpers/get-stored-subtype";
import { environment } from "../../../stores/environment";

  export let name : string = "";
  export let info : TypeDefinition<{}>;
  export let parentKey : number;
  export let path = "";
  export let bopModules : Writable<ModuleCard[]>;

  const fullPath = path ? `${path}.${name}` : name

  let currentInfo : TypeDefinition;
  $: currentInfo = info.type === "cloudedObject" ? getStoredDefinition($bopModules, Number(parentKey), fullPath, "output") : info


</script>

<div class="total">
  <ConnectionKnob
    bopModules={bopModules}
    info={currentInfo}
    parentKey={parentKey}
    fullPathName={fullPath}
    nobType="module"
    let:item
    subtypeStyle="position: absolute; background-color: grey; top: 0; transform: translateY(-100%); padding: 0 0 8px 6px; border-radius: 6px 0 0 6px"
  ><span class="text" slot="right">{name}</span>
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
    user-select: none;
    margin: 7px 0px 0px auto;
    width: max-content;
  }
</style>

