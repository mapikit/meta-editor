<script lang="ts">
  // There be dragons beyond this point, take all this code with a pinch of salt
  // (Many) Changes are to be expected
  import Module from "./module-cards/module-card.svelte";
  import { functionsInfo } from "./functions-info";
  import { onMount } from "svelte";
  import { updateTraces } from "./update-traces";
  import type { ModuleCard } from "../../common/types/module-card";
  import beautify from "json-beautify";
  import { getFullName } from "../../common/helpers/get-full-name";
  import type { UICompliantBop } from "../../common/types/ui-bop";
  import { bopStore } from "../../stores/bop-store";

  let currentBop : UICompliantBop;
  let moduleSelection : HTMLSelectElement = undefined;
  let canvas : HTMLCanvasElement;
  let context : CanvasRenderingContext2D;

  bopStore.subscribe(bop => currentBop = bop)

  onMount(() => {
    context = canvas.getContext("2d");
    const scale = canvas.clientWidth/canvas.width
    canvas.width *= scale;
    canvas.height *= scale;

    context.strokeStyle = "#ffffff";
    context.lineWidth = 2

    bopStore.subscribe((bop) => {
      currentBop = bop;
      updateTraces(context, canvas.height, canvas.width);
    })
  })

  
  
  // TODO Actually implement this without jank
  function addModuleToBop() {
    bopStore.update((bop) => {
      const infolessModule : Omit<ModuleCard, "info"> = { 
        key: Math.random()*1000,
        moduleType: "internal",
        moduleName: moduleSelection.value.replace("internal.", ""),
        dependencies: [],
      }
      bop.configuration.push({
        ...infolessModule,
        info: functionsInfo.get(getFullName(infolessModule))
      })
      moduleSelection.value = null;
      return bop;
    })
  }

  function copyBOpToClipboard() {
    console.log(currentBop);
    // TODO filter out ui properties
    navigator.clipboard.writeText(beautify(currentBop, null, 1, 110))
  }
</script>

<canvas class="canvas" bind:this={canvas}/>
  {#each currentBop.configuration as config}
    <Module moduleConfig={config}/>
  {/each}
  
  <select class="selection" name="select" bind:this={moduleSelection} on:input={() => addModuleToBop()}>
    <option value={null}>-Select a Module-</option>
    {#each Array.from(functionsInfo.keys()) as name}
      <option value={name}>{name}</option>
    {/each}
  </select>
  <input class="buttonCpy" type="button" value="Copy Bop" on:click={() => copyBOpToClipboard()}>


<style>
  .canvas {
    width: 100%;
    background: url("../../../static/images/dotted-back.jpg") rgb(16, 15, 17);
  }
  
  .selection {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .buttonCpy {
    position: absolute;
    top: 10px;
    left: 250px;
  }
</style>