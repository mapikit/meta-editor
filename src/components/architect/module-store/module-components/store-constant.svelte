<script lang="ts">
import beautify from "json-beautify";
import type { BopsConstant }
  from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import type { ArchitectContext } from "src/entities/auxiliary-entities/architect-context";
import { getContext } from "svelte";
import { typeColors } from "../../../../common/styles/type-colors";
import Draggable from "../../draggable.svelte";
import DraggingStoreConstant from "./dragging-store-constant.svelte";

export let constant : BopsConstant;
const context = getContext<ArchitectContext>("architectContext");

let ref : HTMLDivElement;
let { dragging, draggingElement } = context;


function getExtendedString (value : unknown) : string {
  if(typeof value === "object") return beautify(value, null, 1);
  return value.toString();
}

</script>
<Draggable style="mt-1 h-7 flex flex-row w-full transition-all" dragElement={ref} dragType={"constant"}>
<div bind:this={ref}>
  <div class="bg-norbalt-350 total h-full max-w-full rounded-md select-none relative pr-6 pl-2 constant-nip">
    <div class="name">{constant.name}: </div>
    <abbr title={getExtendedString(constant.value)} class="text" style="color: {typeColors[constant.type]};">{constant.value}</abbr>
    <div class="indicator" style="color: {typeColors[constant.type]};">  ●</div>
  </div>
</div>
</Draggable>
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