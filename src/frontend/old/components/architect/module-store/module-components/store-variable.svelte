<script lang="ts">
import beautify from "json-beautify";
import type { BopsVariable, ModuleType }
  from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import type { ArchitectContext } from "src/entities/auxiliary-entities/architect-context";
import type { UIBusinessOperation } from "src/entities/business-operation";
import { getContext } from "svelte";
import { typeColors } from "../../../../common/styles/type-colors";
import Draggable from "../../draggable.svelte";
import DraggingStoreConstant from "./dragging-store-constant.svelte";
import { clickOutside } from "../../helpers/click-outside";
import type { StoreModuleInfo } from "../../../../common/types/store-module-info";
import { addObjectKey } from "../../../../common/helpers/add-object-key";
import StoreModule from "./store-module.svelte";
	import ChevronIcon from "../../../../icons/chevron-icon.svelte";
	import { slide } from "svelte/transition";

export let variable : BopsVariable;
const context = getContext<ArchitectContext>("architectContext");
const currentBop = getContext<UIBusinessOperation>("currentBop");
const { storeModalOpen, storeModalContent, storeModalData } = context;

let ref : HTMLDivElement;
let { dragging, draggingElement } = context;
let isHoveringDelete = false;

let isOpen = false;

function getExtendedString (value : unknown) : string {
  if(typeof value === "object") return beautify(value, null, 1);
  return value.toString();
}

const removeConst = () : void => {
  currentBop.removeVariable(variable.name);
};

const toggleHover = () : void => {
  isHoveringDelete = !isHoveringDelete;
};

$: hoverStyle = isHoveringDelete ? "stroke-white" : "stroke-transparent";

const editVar = () : void => {
  storeModalOpen.set(true);
  storeModalContent.set("editVariable");
  storeModalData.set({
    name: variable.name,
    type: variable.type,
    initialValue: variable.initialValue,
  });
};

const setVariableModule : { type : ModuleType, moduleInfo : StoreModuleInfo } = {
  type: "variable",
  moduleInfo: {
    functionName: "setVariables",
    schemaName: variable.name, // Not required, we're using this field as a helper for this case
    input: addObjectKey({}, variable.name, { type: variable.type, required: true }),
    output: { updatedCount: { type: "number", required: true } },
  },
};

const increaseVariableModule : { type : ModuleType, moduleInfo : StoreModuleInfo } = {
  type: "variable",
  moduleInfo: {
    functionName: "increaseVariables",
    schemaName: variable.name, // Not required, we're using this field as a helper for this case
    input: addObjectKey({}, variable.name, { type: variable.type, required: true }),
    output: { updatedCount: { type: "number", required: true } },
  },
};

const decreaseVariableModule : { type : ModuleType, moduleInfo : StoreModuleInfo } = {
  type: "variable",
  moduleInfo: {
    functionName: "decreaseVariable",
    schemaName: variable.name, // Not required, we're using this field as a helper for this case
    input: addObjectKey({}, variable.name, { type: variable.type, required: true }),
    output: { updatedCount: { type: "number", required: true } },
  },
};

let isIncreasable = variable.type === "number";
let availableModules = isIncreasable
  ? [setVariableModule, increaseVariableModule, decreaseVariableModule] : [setVariableModule];
let expanded = false;
let chevronStyle;
$: chevronStyle = expanded ? "rotate-0" : "-rotate-90";
</script>
<div class="mt-1 h-7 flex flex-row w-full transition-all max-w-full" on:mouseenter={toggleHover} on:mouseleave={toggleHover}>
  <Draggable dragData={variable} style="h-7 flex flex-row w-full transition-all" dragElement={ref} dragType={"variable"}>
  <div bind:this={ref}>
    <div class="bg-norbalt-350 total h-full max-w-[80%] rounded-md select-none relative pr-6 pl-6 rounded-l-full constant-nip">
      <div class="name">{variable.name}: </div>
      {#if variable.initialValue}
        <abbr title={getExtendedString(variable.initialValue)} class="text" style="color: {typeColors[variable.type]};">{variable.initialValue}</abbr>
      {/if}
      <div class="indicator" style="color: {typeColors[variable.type]};">  ●</div>
    </div>
  </div>
  </Draggable>
  <div class="relative h-6 mt-1 w-7 text-xl font-bold bg-norbalt-400 text-center rounded cursor-pointer {hoverStyle} text-offWhite transition-all hover:text-white z-[1]"
    use:clickOutside on:outclick={() => { isOpen = false; }} on:click={() => { isOpen = !isOpen; }}
  >
    <p class="-mt-1.5"> ... </p>
    {#if isOpen}
    <div class="absolute right-0 top-8 rounded shadow bg-norbalt-350 overflow-hidden text-center text-sm font-bold">
      <div class="pt-2 px-4 pb-1 transition-all hover:bg-norbalt-500 cursor-pointer border-2 border-transparent text-offWhite hover:text-ochreYellow-light hover:border-ochreYellow"
        on:click={editVar}
      >
        Edit
      </div>
      <div class="pb-2 px-4 pt-1 transition-all hover:bg-norbalt-500 cursor-pointer border-2 border-transparent text-offWhite hover:text-roseRed-light hover:border-roseRed"
        on:click={removeConst}
      >
        Delete
      </div>
    </div>
  {/if}
  </div>
</div>
{#if $dragging && (($draggingElement).element === ref)}
  <DraggingStoreConstant constantName={variable.name}/>
{/if}

<div class="border border-1 rounded border-norbalt-100 p-2 mt-5 relative transition-all">
  <p class="text-offwhite bg-norbalt-200 absolute top-0 -translate-y-[50%] px-2 cursor-pointer" on:click={() => { expanded = ! expanded; }}> {variable.name} Modifiying Functions 
    <span class="inline-block ml-1 -translate-y-0.5"><ChevronIcon style={chevronStyle + " stroke-white"} /></span></p>
    {#if expanded}
      {#each availableModules as storeModule }
        <StoreModule module={storeModule.moduleInfo} moduleType={storeModule.type}/>
      {/each}
    {/if}
</div>
<style lang="scss">
  .total {
    transition: filter 30ms cubic-bezier(0.075, 1.045, 0.805, 0.980), transform 500ms ease-in-out;
    width: 100%;
  }

  .constant-nip {
    margin-top: 3px;
    text-align:  left;
    clip-path: polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%);
  }

  .indicator {
    text-align: right;
    display: inline-block;
    max-width: 16px;
    grid-column: 2;
  }

  .name {
    display: inline;
    max-width: 20%;
  }

  .text {
    display: inline-block;
    max-width: calc(80% - 16px);
    overflow: hidden;
    vertical-align: bottom;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-decoration: none;
  }
</style>