<script lang="ts">
import beautify from "json-beautify";
import type { BopsConstant }
  from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import type { ArchitectContext } from "src/entities/auxiliary-entities/architect-context";
import type { UIBusinessOperation } from "src/entities/business-operation";
import { getContext } from "svelte";
import { typeColors } from "../../../../common/styles/type-colors";
import Draggable from "../../draggable.svelte";
import DraggingStoreConstant from "./dragging-store-constant.svelte";
import { clickOutside } from "../../helpers/click-outside";

export let constant : BopsConstant;
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
  currentBop.removeConstant(constant.name);
};

const toggleHover = () : void => {
  isHoveringDelete = !isHoveringDelete;
};

$: hoverStyle = isHoveringDelete ? "opacity-100" : "opacity-50";

const editConst = () : void => {
  storeModalOpen.set(true);
  storeModalContent.set("editConstant");
  storeModalData.set({
    name: constant.name,
    type: constant.type,
    value: constant.value,
  });
};

</script>
<div class="mt-1 h-7 flex flex-row w-full transition-all" on:mouseenter={toggleHover} on:mouseleave={toggleHover}>
  <Draggable dragData={constant} style="h-7 flex flex-row w-full transition-all" dragElement={ref} dragType={"constant"}>
    <div bind:this={ref}>
      <div class="bg-norbalt-350 total h-full max-w-full rounded-md select-none relative pr-6 pl-2 constant-nip">
        <div class="name">{constant.name}: </div>
        <abbr title={getExtendedString(constant.value)} class="text" style="color: {typeColors[constant.type]};">{constant.value}</abbr>
        <div class="indicator" style="color: {typeColors[constant.type]};">  ●</div>
      </div>
    </div>
  </Draggable>
  <div class="relative h-6 mt-1 w-7 text-xl font-bold bg-norbalt-400 text-center rounded cursor-pointer {hoverStyle} text-offWhite transition-all hover:text-white"
    use:clickOutside on:outclick={() => { isOpen = false; }} on:click={() => { isOpen = !isOpen; }}
  >
    <p class="-mt-1.5"> ... </p>
    {#if isOpen}
    <div class="absolute right-0 top-8 rounded shadow bg-norbalt-350 overflow-hidden text-center text-sm font-bold">
      <div class="pt-2 px-4 pb-1 transition-all hover:bg-norbalt-500 cursor-pointer border-2 border-transparent text-offWhite hover:text-ochreYellow-light hover:border-ochreYellow"
        on:click={editConst}
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
  <DraggingStoreConstant constantName={constant.name}/>
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