<script lang="ts">
  import { fade } from "svelte/transition";

  export let position : "top" | "bottom" | "left" | "right" = "left";
  export let tooltipContent  = "%NOTOOLTIPTEXTPROVIDED%";
  export let visible  = false;
  let component : HTMLDivElement;
  let componentRect : DOMRect;
  let visibilityDelay : NodeJS.Timeout;
  let showing = visible;

  let xOffset = "";
  let arrowPos = "";
  let anchorPos = "";

  let maxWidth = 0;


  $: updateVisibilityDelay(visible);
  $: componentRect = component?.getBoundingClientRect();

  function updateVisibilityDelay (visible : boolean) : void {
    if(visibilityDelay !== undefined) clearTimeout(visibilityDelay);
    switch (visible) {
      case true:
        showing = true;
        return;
      case false:
        visibilityDelay = setTimeout(() => {
          showing = false;
        }, 200);
    }
  }


  $: xOffset = getPosition(componentRect, showing);
  $: arrowPos = getArrowPos(componentRect, showing);
  $: anchorPos = getParentAnchorPosition(component, showing);

  const getPosition = (...comp) => {
    switch (position) {
      case "left": return "transform: translateX(-16px) translateY(-50%);";
      case "right": return "transform: translateX(14px) translateY(-50%);";
      case "top": return `transform: translateX(calc(-50% - ${getMarginXDisplacement()}px)) translateY(calc(-100% - 18px))`;
      case "bottom": return `transform: translateX(calc(-50% - ${getMarginXDisplacement()}px)) translateY(18px);`;
    }
  };

  const getParentAnchorPosition = (...comp) => {
    switch(position) {
      case "left": return "left: 0";
      case "right": return "right: 0";
      case "top": return "top: 0";
      case "bottom": return "bottom: 0";
    }
  };

  function getMarginXDisplacement () : number {
    const rect = component?.getBoundingClientRect();
    if(rect === undefined) return 0;
    if(rect.x + rect.width >= maxWidth) return (rect.x + rect.width) - maxWidth + 8;
    return 0;
  }

  $: arrowPos = getArrowPos(component);

  function getArrowPos (...comp) {
    // console.log(component?.getBoundingClientRect())
    switch (position) {
      case "left": return "right: -5px; top: calc(50% - 9px); transform: rotate(45deg);";
      case "right": return "left: -5px; top: calc(50% - 9px); transform: rotate(45deg);";
      case "top": return `bottom: -6px; left: calc(50%); transform: translateX(${getMarginXDisplacement()}px) rotate(45deg);`;
      case "bottom": return `top: -6px; left: calc(50%); transform: translateX(${getMarginXDisplacement()}px) rotate(45deg);`;
    }
  }

  let hiddenClass = "";
  $: hiddenClass = showing ? "" : "opacity-0";

</script>


{#if showing}
  <div class="absolute opacity-100 transition-all delay-200 {hiddenClass}" transition:fade={{ duration: 80 }} style="{anchorPos}">
    <div class="fixed z-20 px-3 py-1 rounded-lg bg-norbalt-100 w-max max-w-sm font-sans text-l font-semibold shadow" style="{xOffset}" bind:this={component}>
      <div class="bg-norbalt-100 origin-center w-4 h-4 rounded-sm absolute" style="{arrowPos}"/>
      {tooltipContent}
    </div>
  </div>
{/if}

<svelte:window bind:innerWidth={maxWidth}/>
