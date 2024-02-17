<script lang="ts">
  import beautify from "json-beautify";
  import type { ArchitectContext } from "src/entities/auxiliary-entities/architect-context";
  import { getContext } from "svelte";
  import { typeColors } from "../../../../common/styles/type-colors";
  import Draggable from "../../draggable.svelte";
  import DraggingStoreConstant from "./dragging-store-constant.svelte";
import type { EnvironmentVariable } from "../../../../entities/environment-variable";
import { get } from "svelte/store";
  
  export let env : EnvironmentVariable;
  const context = getContext<ArchitectContext>("architectContext");
  
  let ref : HTMLDivElement;
  let { dragging, draggingElement } = context;
  let isHoveringDelete = false;
    
  function getExtendedString (value : unknown) : string {
    if(typeof value === "object") return beautify(value, null, 1);
    return value.toString();
  }
  
  const toggleHover = () : void => {
    isHoveringDelete = !isHoveringDelete;
  };
  
  $: hoverStyle = isHoveringDelete ? "opacity-100" : "opacity-50";
  
  </script>
  <div class="mt-1 h-7 flex flex-row w-full transition-all" on:mouseenter={toggleHover} on:mouseleave={toggleHover}>
    <Draggable dragData={env} style="h-7 flex flex-row w-full transition-all" dragElement={ref} dragType={"env"}>
      <div bind:this={ref}>
        <div class="bg-norbalt-350 total h-full max-w-full rounded-md select-none relative pr-6 pl-2 constant-nip">
          <div class="name">{get(env.key)}: </div>
          <abbr title={getExtendedString(get(env.value))} class="text" style="color: {typeColors.string};">{get(env.value)}</abbr>
          <div class="indicator" style="color: {typeColors.string};">  ●</div>
        </div>
      </div>
    </Draggable>
  </div>
  {#if $dragging && (($draggingElement).element === ref)}
    <DraggingStoreConstant constantName={get(env.key)}/>
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