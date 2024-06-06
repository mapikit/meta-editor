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

  function updateVisibilityDelay (_visible : boolean) : void {
    if(visibilityDelay !== undefined) clearTimeout(visibilityDelay);
    switch (_visible) {
      case true:
        visibilityDelay = setTimeout(() => {
          showing = true;
        }, 650);
        break;
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
      case "left": return "transform: translateX(calc(-100% - 16px)) translateY(-50%);";
      case "right": return "transform: translateX(14px) translateY(-50%);";
      case "top": return "transform: translateX(-50%) translateY(calc(-100% - 16px))";
      case "bottom": return "transform: translateX(-50%) translateY(18px);";
    }
  };

  const getParentAnchorPosition = (...comp) => {
    switch(position) {
      case "left": return "left: 0";
      case "right": return "right: 0";
      case "top": return "top: 0; right: 50%;";
      case "bottom": return "bottom: 0; right: 50%;";
    }
  };

  function getMarginXDisplacement () : number {
    const rect = component?.getBoundingClientRect();
    if(rect === undefined) return 0;
    if(rect.x + rect.width >= maxWidth) return (rect.x + rect.width) - maxWidth + 8;
    return 0;
  }

  $: arrowPos = getArrowPos(component);

  function getArrowPos (...comp) : string {
    switch (position) {
      case "left": return "right: -6px; top: calc(50% - 8px); transform: rotate(45deg);";
      case "right": return "left: -6px; top: calc(50% - 8px); transform: rotate(45deg);";
      case "top": return "bottom: -8px; left: calc(50%); transform: translateX(-8px) rotate(45deg);";
      case "bottom": return "top: -8px; left: calc(50%); transform: translateX(-8px) rotate(45deg);";
    }
  }

  let hiddenClass = "";
  $: leftDirection = position === "left" ? "" : "" ;
  $: hiddenClass = showing ? "" : "opacity-0";

</script>


{#if showing}
  <div class="absolute whitespace-pre-wrap text-left opacity-100
  transition-all duration-200 delay-200 {hiddenClass}" transition:fade|global={{ duration: 120 }} style="{anchorPos}">
    <div class="fixed z-50 px-3 py-1 rounded-lg bg-norbalt-200
    w-max max-w-sm font-sans text-l font-semibold shadow" style="{xOffset}" bind:this={component}>
      <div class="bg-norbalt-200 origin-center
      w-4 h-4 rounded-sm absolute -z-10" style="{arrowPos}"/>
      {tooltipContent}
    </div>
  </div>
{/if}

<svelte:window bind:innerWidth={maxWidth}/>
