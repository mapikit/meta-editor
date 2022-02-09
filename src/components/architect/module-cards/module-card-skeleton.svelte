<script lang="ts">
  import type { FunctionDefinition } from "@meta-system/meta-function-helper";
  export let definition : FunctionDefinition;
  let cardWidth = 0;
</script>



<div class="module" bind:clientWidth={cardWidth}>
<div class="header"> 
<slot name="delete"></slot><span class="modName">{definition.functionName}</span><span 
      class="tooltip" >?<span 
        class="tooltiptext" 
        style="left: {10+cardWidth}px">{definition["description"]}</span>
  </span>
</div>
<slot name="content"></slot>
</div>

<style lang="scss">
  .module {
    min-width: 120px;
    user-select: none;
    cursor: default;
    background-color: rgb(49, 44, 44);
    border-radius: 5px;
    padding: 0 0 7px 0;
    margin-top: 5px;
  }

  .tooltip {
    background-color: rgb(48, 47, 47);
    padding: 0 7px 0 7px;
    border-radius: 10px;
    margin: 3px 3px 3px 0;
    float: right;
  }
  
  .tooltip .tooltiptext {
    visibility: hidden;
    position: absolute;
    background-color: gray;
    width: max-content;
    max-width: 150%;
    padding: 5px;
    z-index: 3;
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
  }

  .header {
    background-color: rgb(26, 22, 22);
    border-radius: 5px 5px 0 0 ;
    display: inline-block;
    width: 100%;
  }
</style>