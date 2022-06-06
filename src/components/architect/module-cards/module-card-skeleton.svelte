<script lang="ts">
  import type { FunctionDefinition } from "@meta-system/meta-function-helper";
  import InfoIcon from "../../../../static/info-icon.svelte";
  import Tooltip from "../../../components/common/tooltip.svelte";
  export let definition : FunctionDefinition;
  export let tooltipPosition :  "top" | "bottom" | "left" | "right" = "left";
  export let parentSchema = undefined;




  let tooltipVisible = false;

  //SAVE: tooltipContent={definition["description"]}
</script>



<div class="module">
<div class="header"> 

<span class="modName" >{definition.functionName}</span> {#if parentSchema} <span class="schemaName">@{parentSchema}</span> {/if}
  <div class="tooltipIcon"
    on:focus={undefined}
    on:mouseenter={() => { tooltipVisible = true; } }
    on:mouseleave={() => { tooltipVisible = false; } }
  ><InfoIcon width="20px"/>
  <Tooltip visible={tooltipVisible} tooltipContent={definition["description"]} position={tooltipPosition}/>
</div>
  <slot name="moduleNob" ></slot>
</div>
<slot name="content"></slot>
</div>

<style lang="scss">
  .module {
    min-width: 120px;
    user-select: none;
    cursor: default;
    background-color: #34344b;
    border-radius: 5px;
    padding: 0 0 7px 0;
    margin-top: 5px;
  }

  .schemaName {
    color: rgb(148, 148, 148);
  }

  .tooltipIcon {
    border-radius: 10px;
    display: inline-block;
    position: relative;
    margin: 2px;
    top: 2px;
    left: 4px;
  }
  

  .header {
    font-family: 'Dosis';
    font-size: 20px;
    text-align: center;
    background-color: #10101a;
    border-radius: 5px 5px 0 0 ;
    display: inline-block;
    width: 100%;
    padding-left: 8px;
    padding-right: 8px;
  }

  .modName {
    vertical-align: 1.5px;
  }
</style>