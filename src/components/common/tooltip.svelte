<script lang="ts">
  import { fade } from "svelte/transition"


  export let position : "top" | "bottom" | "left" | "right" = "left";
  export let tooltipContent : string = "%NOTOOLTIPTEXTPROVIDED%";
  export let visible : boolean = false;
  let component : HTMLDivElement;


  let xOffset = "";
  let arrowPos = "";

  let maxWidth = 0;


  $: xOffset = getXOffset(component)

  const getXOffset = (comp) => {
    switch (position) {
      case "left": return "transform: translateX(calc(-100% - 16px)) translateY(-50%);"
      case "right": return "transform: translateX(calc(20% - 14px)) translateY(-50%);"
      case "top": return `bottom: calc(100% + 8px); transform: translateX(calc(-50% - ${getMarginXDisplacement()}px));`
      case "bottom": return "transform: translateX(-50%) translateY(50%);"
    }
  }

  function getMarginXDisplacement () : number {
    const rect = component?.getBoundingClientRect();
    if(rect === undefined) return 0;
    if(rect.x + rect.width >= maxWidth) return (rect.x + rect.width) - maxWidth + 8;
    return 0;
  }

  $: arrowPos = getArrowPos(component);

  function getArrowPos (comp) {
    switch (position) {
      case "left": return "right: -5px; top: calc(50% - 7px);"
      case "right": return "left: -5px; top: calc(50% - 7px);"
      case "top": return `bottom: -6px; left: calc(50% + 4px); transform: translateX(${getMarginXDisplacement()}px) rotate(45deg);`
      case "bottom": return "top: -6px; left: calc(50% + 4px);"
    }
  }


</script>

{#if visible}
  <div class="{visible ? "tooltip-holder" : "tooltip-holder out"}" transition:fade={{ duration: 200 }}>
    <div class="content" style="{xOffset}" bind:this={component}>
        <div class="arrow" style="{arrowPos}"/>
      {tooltipContent}
    </div>
  </div>
{/if}

<svelte:window bind:innerWidth={maxWidth}/>

<style lang="scss">
  .tooltip-holder {
    position: absolute;
    top: 50%;
    transition: all 150ms .2s;
    opacity: 1;

    &.out {
      opacity: 0;
    }

    .content {
      position: fixed;
      z-index: 5;
      padding: 12px;
      border-radius: 8px;
      background-color: #2c2c44;
      width: max-content;
      max-width: 350px;
      font-family: 'Dosis';
      font-weight: 600;
      transform-origin: center center;
      box-shadow: 0 3px 6px rgba($color: #000000, $alpha: .8);
    }

    .arrow {
      transform-origin: center center;
      background-color: #2c2c44;
      width: 14px;
      height: 14px;
      border-radius: 2px;
      position: absolute;
    }
  }
</style>