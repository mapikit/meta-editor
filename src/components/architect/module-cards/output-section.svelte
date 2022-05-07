<script lang="ts">
  import { selectedNob } from "../../../stores/connection-stores";
  import { solveConnection } from "../helpers/solve-connection";
  import { typeColors } from "../../../common/styles/type-colors";
  import type { TypeDefinition } from "@meta-system/object-definition";
  import { bopStore } from "../../../stores/bop-store";
import { createEventDispatcher, onDestroy, onMount } from "svelte";

  const dispatch = createEventDispatcher();
  onMount(() => dispatch("mountUnmount"))
  onDestroy(() => dispatch("mountUnmount"))

  export let name : string;
  export let info : TypeDefinition<{}>;
  export let parentKey : number | "input";
  export let path = "";

  console.log(info)


  
  let expanded = false;

  export let nob : HTMLSpanElement = undefined;
  let childNobs : Record<string, HTMLSpanElement> = {};

  const isObject = info.type === "object"


  const handleClick = isObject ? toggleExpansion : getNob;

  function getNob () : void {
    selectedNob.update((current) => {
      return solveConnection(current, {
      parentKey,
      nob,
      property: `${path}.${name}`,
      nobType: "output",
      propertyType: info.type
    })})
  }

  function toggleExpansion () { expanded = !expanded }

  function expandObject() : void {
    if(expanded) {
      const currentDepth = path.split(".").length + 1;
      bopStore.update(bop => {
        bop.configuration.forEach(module => {
          module.dependencies.forEach(dep => {
            if(dep.origin === parentKey) {
              const depthProperties = dep.originPath.split(".")
              depthProperties.splice(0, currentDepth)
              const child = depthProperties[0]
              if(info["subtype"][child] !== undefined) {
                dep.originNob = childNobs[child];
              }
            }
          })
        });
      return bop;
      })
    } else {
      bopStore.update(bop => {
        bop.configuration.forEach(module => {
          module.dependencies.forEach(dep => {
            if(dep.origin === parentKey) dep.originNob = nob;
          })
        });
        return bop;
      })
      
    }
  }
</script>
<div class="box">
<div class="total"><span class="text">{name}</span><span 
  class="nob"
  style="color: {typeColors[info.type]};"
  on:click={handleClick}
  bind:this={nob}>{ isObject ? ( expanded ? "▼" : "⯈") : "●" }</span>
  {#if expanded}
    {#each Object.keys(info["subtype"]) as output}
      <svelte:self
        on:mountUnmount={expandObject}
        path={name}
        name={output}
        info={info["subtype"][output]}
        parentKey={parentKey}
        bind:nob={childNobs[output]}
      />
    {/each}
  {/if}
</div>
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
  }

  .total {
    user-select: none;
    margin: 7px 0px 0px auto;
    width: min-content;
  }
</style>

