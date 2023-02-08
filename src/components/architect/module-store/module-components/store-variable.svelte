<script lang="ts">
import beautify from "json-beautify";
import type { BopsVariable }
  from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import type { ArchitectContext } from "src/entities/auxiliary-entities/architect-context";
import type { UIBusinessOperation } from "src/entities/business-operation";
import CrossIcon from "../../../../icons/cross-icon.svelte";
import { getContext } from "svelte";
import { typeColors } from "../../../../common/styles/type-colors";
import Draggable from "../../draggable.svelte";
import DraggingStoreConstant from "./dragging-store-constant.svelte";

export let variable : BopsVariable;
const context = getContext<ArchitectContext>("architectContext");
const currentBop = getContext<UIBusinessOperation>("currentBop");

let ref : HTMLDivElement;
let { dragging, draggingElement } = context;
let isHoveringDelete = false;

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

</script>
<div class="mt-1 h-7 flex flex-row w-full transition-all" on:mouseenter={toggleHover} on:mouseleave={toggleHover}>
  <Draggable dragData={variable} style="h-7 flex flex-row w-full transition-all" dragElement={ref} dragType={"variable"}>
  <div bind:this={ref}>
    <div class="bg-norbalt-350 total h-full max-w-full rounded-md select-none relative pr-6 pl-6 rounded-l-full constant-nip">
      <div class="name">{variable.name}: </div>
      {#if variable.initialValue}
        <abbr title={getExtendedString(variable.initialValue)} class="text" style="color: {typeColors[variable.type]};">{variable.initialValue}</abbr>
      {/if}
      <div class="indicator" style="color: {typeColors[variable.type]};">  ●</div>
    </div>
  </div>
  <div class="h-full mt-1 ml-2 w-4 flex justify-center items-center cursor-pointer {hoverStyle} hover:stroke-roseRed transition-all" on:click={removeConst}>
    <CrossIcon style="stroke-inherit w-2 h-2"/>
  </div>
  </Draggable>
</div>
{#if $dragging && (($draggingElement).element === ref)}
  <DraggingStoreConstant constantName={variable.name}/>
{/if}

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