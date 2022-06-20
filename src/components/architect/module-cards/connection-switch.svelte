<script lang="ts">
import type { TypeDefinition } from "@meta-system/object-definition";
import type { BopsConstant } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import type { Writable } from "svelte/store";
import type { ModuleCard } from "../../../common/types/module-card";

import InputSection from "./input-section.svelte";
import ModularSection from "./modular-section.svelte";
import OutputSection from "./output-section.svelte";


  export let info : TypeDefinition<{}>;
  export let parentKey : number | "input";
  export let fullPathName : string;
  export let bopModules : Writable<ModuleCard[]>;
  export let nobType : "input" | "output" | "module";
  export let bopsConstants : Writable<BopsConstant[]> = undefined;
  export let name : string;

</script>

{#if nobType === "input"}
  <InputSection
    bopConstants={bopsConstants}
    bopModules={bopModules}
    info={info["subtype"][name]}
    name={name}
    parentKey={Number(parentKey)}
    path={fullPathName}
  />
{:else if nobType === "output"}
  <OutputSection
    bopModules={bopModules}
    info={info["subtype"][name]}
    name={name}
    parentKey={Number(parentKey)}
    path={fullPathName}
  />
{:else if nobType === "module"}
  <ModularSection
    bopModules={bopModules}
    info={info["subtype"][name]}
    parentKey={Number(parentKey)}
    name={name}
    path={fullPathName}
  />
{:else}
  <div>
    MISSING KNOB TYPE
  </div>
{/if}