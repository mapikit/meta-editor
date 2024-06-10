<script lang="ts">
  // This component has turned out to be the most complete makeshift solution that works
  // Perhaps a strong contender for a refactor - because It'll be a pain to maintain this way.
  import { Writable, writable } from "svelte/store";
  import { fade } from "svelte/transition";

  export let position : "top" | "bottom" | "left" | "right" = "left";
  export let tooltipContent  = "%NOTOOLTIPTEXTPROVIDED%";
  export let visible  = false;
  export let xCompensation : Writable<number> = writable(0);
  export let yCompensation : Writable<number> = writable(0);
  let component : HTMLDivElement;
  let positionTesterComponent : HTMLDivElement;
  let componentRect : DOMRect;
  let visibilityDelay : NodeJS.Timeout;
  let showing = visible;
  let finalPosition = position;

  let offset = "";
  let arrowPos = "";
  let anchorPos = "";
  let movedOutOfScreenAmount = 0;
  let arrowMoveAmount = 0;
  let maxWidth = 0;


  $: updateVisibilityDelay(visible);
  $: componentRect = component?.getBoundingClientRect();
  $: (() => {setFinalPosition(positionTesterComponent, visible); })();

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


  $: offset = getPosition(componentRect, showing, $xCompensation);
  $: arrowPos = getArrowPos(componentRect, showing, $xCompensation);
  $: anchorPos = getParentAnchorPosition(component, showing, $xCompensation);

  const getPosition = (...comp) : string => {
    const topOffscreenMove = ["top", "bottom"].includes(position) ? 0 : -movedOutOfScreenAmount;
    const leftOffscreenMove = ["left", "right"].includes(position) ? 0 : -movedOutOfScreenAmount;

    switch (finalPosition) {
      case "left": return `transform: translateX(calc(-100% - 8px)) translateY(calc(-50% + ${topOffscreenMove}px));`;
      case "right": return `transform: translateX(8px) translateY(calc(-50% + ${topOffscreenMove}px));`;
      case "top": return `transform: translateX(calc(-50% + ${leftOffscreenMove}px)) translateY(calc(-100% - 8px))`;
      case "bottom": return `transform: translateX(calc(-50% + ${leftOffscreenMove}px)) translateY(8px);`;
    }
  };

  const getParentAnchorPosition = (...comp) : string => {
    switch(finalPosition) {
      case "left": return `left: calc(0px + ${$xCompensation}px)`;
      case "right": return "right: 0"; // Add these compensation as you need them.
      case "top": return "top: 0; right: 50%;";
      case "bottom": return `bottom: calc(0px + ${$yCompensation}px); right: calc(50% + ${$xCompensation}px);`;
    }
  };

  // eslint-disable-next-line max-lines-per-function
  function setFinalPosition (...comp) : void {
    let shouldFlip = false;
    let moveAmount = 0;
    movedOutOfScreenAmount = 0;
    finalPosition = position;
    arrowMoveAmount = 0;
    let securityMargin = 6;

    const windowInfo = { width: window.innerWidth, height: window.innerHeight };
    const rect = positionTesterComponent?.getBoundingClientRect();
    // const parentRect = positionTesterComponent?.parentElement.parentElement.getBoundingClientRect();
    if (!rect) return;

    if (["left", "right"].includes(position)) {
      shouldFlip = position === "left"
        ? rect.x <= 0
        : rect.right >= windowInfo.width;

      moveAmount = rect.y <= 0 ? rect.y - securityMargin
        : rect.bottom >= windowInfo.height
          ? rect.bottom - windowInfo.height + securityMargin : 0;

    } else {
      shouldFlip = position === "top"
        ? rect.y <= 0
        : rect.bottom >= windowInfo.height;

      moveAmount = rect.x <= 0 ? rect.x - securityMargin
        : rect.right >= windowInfo.width
          ? rect.right - windowInfo.width + securityMargin : 0;
    }

    if (shouldFlip) {
      switch (position) {
        case "top": finalPosition = "bottom"; break;
        case "bottom": finalPosition = "top"; break;
        case "left": finalPosition = "right"; break;
        case "right": finalPosition = "left"; break;
      }
    }

    movedOutOfScreenAmount = moveAmount;
    arrowMoveAmount = Math.min(moveAmount, (["left", "right"].includes(position) ? rect.height : rect.width)/2);
  }

  $: arrowPos = getArrowPos(component);

  function getArrowPos (...comp) : string {
    const topOffscreenMove = ["top", "bottom"].includes(position) ? 0 : -arrowMoveAmount;
    const leftOffscreenMove = ["left", "right"].includes(position) ? 0 : -arrowMoveAmount;

    switch (finalPosition) {
      case "left": return `right: 6px; top: calc(50% - 8px - ${topOffscreenMove}px); transform: rotate(45deg);`;
      case "right": return `left: 6px; top: calc(50% - 8px - ${topOffscreenMove}px); transform: rotate(45deg);`;
      case "top": return `bottom: 6px; left: calc(50% - ${leftOffscreenMove}px); transform: translateX(-8px) rotate(45deg);`;
      case "bottom": return `top: 6px; left: calc(50% - ${leftOffscreenMove}px); transform: translateX(-8px) rotate(45deg);`;
    }
  }

  let hiddenClass = "";
  $: hiddenClass = showing ? "" : "opacity-0";

  let arrowPadding = "";

  $: arrowPadding = finalPosition === "left"
    ? "pr-3" : finalPosition === "right"
      ? "pl-3" : finalPosition === "top"
        ? "pb-3" : "pt-3";
</script>

{#if visible}
  <!-- Position tester - spawns before the visible one to see if it is out of the screen -->
  <div class="absolute whitespace-pre-wrap text-left" style="{anchorPos}">
    <div class="fixed z-50 {arrowPadding}
    w-max max-w-sm font-sans overflow-hidden" style="visibility: hidden; {offset}" bind:this={positionTesterComponent}>
      <div class="px-3 py-1">
        {tooltipContent}
        <div class="origin-center
        w-4 h-4 absolute z-10" style="{arrowPos}"/>
      </div>
    </div>
  </div>
{/if}

{#if showing}
  <div class="absolute whitespace-pre-wrap text-left opacity-100
  transition-all duration-200 delay-200 {hiddenClass}" transition:fade|global={{ duration: 120 }} style="{anchorPos}">
    <div class="fixed z-50 {arrowPadding} delay-500 transition-all
    w-max max-w-sm font-sans shadow overflow-hidden" style="{offset}" bind:this={component}>
      <div class="px-3 py-1 rounded bg-norbalt-200">
        {tooltipContent}
        <div class="bg-norbalt-200 origin-center
        w-4 h-4 rounded-sm absolute -z-10" style="{arrowPos}"/>
      </div>
    </div>
  </div>
{/if}

<svelte:window bind:innerWidth={maxWidth}/>
