<script lang="ts">
  import type { ObjectDefinition, TypeDefinition } from "@meta-system/object-definition";
  import { SectionsMap, sectionsMap } from "../helpers/sections-map";
  import { EditorLevel, EditorLevels } from "../../object-definition/obj-def-editor-types-and-helpers";
  import { typeColors } from "../../../common/styles/type-colors"
  import { selectedNob } from "../../../stores/connection-stores";
  import { solveConnection } from "../helpers/solve-connection";
  import type { Writable } from "svelte/store";
  import type { ModuleCard } from "../../../common/types/module-card";
  import ObjectDefinitionMiniApp from "../../object-definition/object-definition-mini-app.svelte";
  import type { BopsConstant } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import { onMount } from "svelte";
  import ConstantTag from "../tags/constant-tag.svelte";
  import InputSection from "./input-section.svelte";
  import OutputSection from "./output-section.svelte";

  export let info : TypeDefinition<{}>;
  export let parentKey : number | "input";
  export let fullPathName : string;
  export let bopModules : Writable<ModuleCard[]>;
  export let nobType : "input" | "output";
  export let bopsConstants : Writable<BopsConstant[]> = undefined;

  let getPathsNames : () => string[];
  let navigateBackToLevel : (index : number) => void;
  let getDefinitionAndData : () => { definition: ObjectDefinition, data : object };

  let attatchedConstant : BopsConstant = undefined;
  let editing : boolean = false;
  let expanded : boolean = false;

  onMount(() => {
    if(nobType === "input") {
      const parentInfo = $bopModules.find(module => module.key === parentKey);
      const constDependency = parentInfo.dependencies.find(dependency => 
        dependency.targetPath === fullPathName && 
        ["constant", "constants"].includes(dependency.origin as string));
      if(constDependency !== undefined) attatchedConstant = $bopsConstants.find(constant => constant.name === constDependency.originPath);
    }
  })

  export function toggleEdition () {
    expanded = false;
    if(editing) {
      bopModules.update(modules => {
        const parentModule = modules.find(mod => mod.key === parentKey);
        const newInfo = {};
        let aux = newInfo;
        for(const step of fullPathName.split(".")) {
          aux[step] = {}
          aux = aux[step];
        }
        aux["type"] = "cloudedObject"
        aux["subtype"] = getDefinitionAndData().definition["root"]["subtype"];
        parentModule.storedDefinition[nobType] = Object.assign(parentModule.storedDefinition[nobType] ?? {}, newInfo);
        return modules;
      })
    }
    editing = !editing;
  }

  const knobIdentifier = SectionsMap.getIdentifier(parentKey, `${nobType === "output" ? "result." : ""}${fullPathName}`);

  const isObject = info.type === "object";
  const isClouded = info.type === "cloudedObject";
  const handleClick = (isObject || isClouded) ? toggleExpansion : getKnob;

  function toggleExpansion () {
    expanded = !expanded;
    setTimeout(() => { 
      sectionsMap.refreshConnections($bopModules);
      bopModules?.update(mod => mod);
    }, 20)
  }

  function getKnob () : void {
    selectedNob.update((current) => {
      return solveConnection(current, {
      parentKey,
      nob: sectionsMap[nobType][knobIdentifier],
      property: fullPathName,
      nobType,
      propertyType: info.type
    }, bopModules)})
  }
</script>
<span class="total" id={nobType} data={`${parentKey}.${fullPathName}`}>
  <slot name="right"/><span 
  class="knob"  style="color: {typeColors[info.type]};"
  on:click={handleClick}
  bind:this={sectionsMap[nobType][knobIdentifier]}>{ isObject || isClouded ? ( expanded ? "▼" : "⯈") : "●" }
  </span><slot name="left"/>
  {#if attatchedConstant !== undefined}<ConstantTag config={attatchedConstant}/>{/if}
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
  <div class="subtype">
    {#each Object.keys(info["subtype"] ?? {}) as output}
      <svelte:component
        this={nobType === "input" ? InputSection : OutputSection}
        path={fullPathName}
        name={output}
        info={info["subtype"][output]}
        parentKey={parentKey}
        bopModules={bopModules}
        bopsConstants={bopsConstants}
      />
    {/each}
  </div>
{/if}
</span>


<style lang="scss">
  .subtype {
  }

  .knob {
    cursor: default;
    padding: 0 2px 3px 2px;
    background-color: #191928;
    transition-duration: 125ms;
    margin-left: 0;
  }

  .knob:hover {
    background-color: lightgray;
    transition-duration: 125ms;
  }
</style>