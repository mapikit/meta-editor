<script lang="ts">
  import type { TypeDefinition } from "@meta-system/object-definition";
  import { SectionsMap, sectionsMap } from "../helpers/sections-map";
  import { EditorLevel, EditorLevels } from "../../object-definition/obj-def-editor-types-and-helpers";
  import { typeColors } from "../../../common/styles/type-colors"
  import { selectedNob } from "../../../stores/connection-stores";
  import { solveConnection } from "../helpers/solve-connection";
  import type { Unsubscriber, Writable } from "svelte/store";
  import type { ModuleCard } from "../../../common/types/module-card";
  import ObjectDefinitionMiniApp from "../../object-definition/object-definition-mini-app.svelte";
  import type { BopsConstant } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import { onDestroy, onMount,  } from "svelte";
  import ConstantTag from "../tags/constant-tag.svelte";
  import { updateTraces } from "../update-traces";

  export let info : TypeDefinition<{}>;
  export let parentKey : number | "input";
  export let fullPathName : string;
  export let bopModules : Writable<ModuleCard[]>;
  export let nobType : "input" | "output" | "module" | "functional";
  export let bopsConstants : Writable<BopsConstant[]> = undefined;
  export let subtypeStyle : string = "";

  const isModuleRoot = nobType === "module" && !fullPathName;
  const colorType = isModuleRoot ? "function" : info.type;

  const prePath = 
    nobType === "output" ? "result" :
    nobType === "module" ? "module" : undefined;

  const propertyPath = [parentKey !== "input" ? prePath : undefined, fullPathName].filter(value => value).join(".")

  let miniApp : ObjectDefinitionMiniApp;

  let attatchedConstant : BopsConstant = undefined;
  let editing : boolean = false;
  let expanded : boolean = false;
  let connecting = false;

  let unsubscribe : Unsubscriber = () => {};

  onMount(() => {
    sectionsMap.refreshConnections($bopModules);
  });

  if(nobType === "input") {
    unsubscribe = bopModules.subscribe(modules => {
      const parentInfo = modules.find(module => module.key === parentKey);
      if(!parentInfo) return;
      const constDependency = parentInfo.dependencies.find(dependency => 
      dependency.targetPath === fullPathName && 
      ["constant", "constants"].includes(dependency.origin as string));
      attatchedConstant = $bopsConstants.find(constant => constant.name === constDependency?.originPath);
    });
  }

  onDestroy(() => unsubscribe());

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
        aux["subtype"] = miniApp.getDefinitionAndData().definition["root"]["subtype"];
        parentModule.storedDefinition[nobType] = Object.assign(parentModule.storedDefinition[nobType] ?? {}, newInfo);
        return modules;
      })
    }
    editing = !editing;
  }

  const knobIdentifier = SectionsMap.getIdentifier(parentKey, propertyPath);
  const isExpandable = info.type === "object" || info.type === "cloudedObject";
  const isClouded = info.type === "cloudedObject";

  const handleClick = (event : MouseEvent) => {
    event.stopPropagation();
    connecting = true;
    sectionsMap.activeLinkingOrigin = sectionsMap[nobType][knobIdentifier];
    selectedNob.set({
      parentKey,
      nob: sectionsMap[nobType][knobIdentifier],
      property: propertyPath,
      nobType,
      propertyType: info.type
    });
  }

  function handleConnectionDrag (event : MouseEvent) : void {
    if(connecting) {
      updateTraces({ cursor: event });
    }
  }

  function attemptConnection () {
    solveConnection({
      parentKey,
      nob: sectionsMap[nobType][knobIdentifier],
      property: propertyPath,
      nobType,
      propertyType: info.type
    }, bopModules);
    selectedNob.set(undefined);
  }

  function toggleExpansion () {
    if(!(isExpandable || isClouded)) return;
    expanded = !expanded;
    setTimeout(() => {
      sectionsMap.refreshConnections($bopModules);
      bopModules?.update(mod => mod);
    }, 20);
  }
</script>

<span class="total" id={nobType} data={`${parentKey}.${fullPathName}`}>
  <slot name="right"/><span 
  class="knob"  style="color: {typeColors[colorType]};"
  on:mousedown={handleClick}
  on:mouseup={attemptConnection}
  on:click={toggleExpansion}
  bind:this={sectionsMap[nobType][knobIdentifier]}>{ isExpandable || isClouded ? ( expanded ? "▼" : "⯈") : "●" }
  </span><slot name="left"/>
  {#if attatchedConstant !== undefined}<ConstantTag config={attatchedConstant} fullPathName={fullPathName} parentKey={Number(parentKey)} bopModules={bopModules}/>{/if}
  {#if editing}
    <ObjectDefinitionMiniApp
      bind:this={miniApp}
      editingLevel={new EditorLevel(EditorLevels.createDefinition)} 
      initialDefinition={info["subtype"]} initialData={{}}
    />
  {/if}
  {#if expanded}
    <div style={subtypeStyle}>
      {#each Object.keys(info["subtype"] ?? {}) as key, index}
        <slot item={{ name: key, fullPathName, info: info["subtype"] !== undefined ? info["subtype"][key] : {}, index }}> SBSLOT </slot>
      {/each}
    </div>
  {/if}
</span>

<svelte:window on:mousemove={handleConnectionDrag} on:mouseup={() => { connecting = false; updateTraces() }}/>


<style lang="scss">
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