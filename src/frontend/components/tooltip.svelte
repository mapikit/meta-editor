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
  let moveOutOfScreenAmount = 0;
  let arrowAllowedMovementAmount = 0;
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
    const topOffscreenMove = ["top", "bottom"].includes(position) ? 0 : -moveOutOfScreenAmount;
    const leftOffscreenMove = ["left", "right"].includes(position) ? 0 : -moveOutOfScreenAmount;

    switch (finalPosition) {
      case "left": return `transform: translateX(calc(-100% - 16px)) translateY(calc(-50% + ${topOffscreenMove}px));`;
      case "right": return `transform: translateX(14px) translateY(calc(-50% + ${topOffscreenMove}px));`;
      case "top": return `transform: translateX(calc(-50% + ${leftOffscreenMove}px)) translateY(calc(-100% - 16px))`;
      case "bottom": return `transform: translateX(calc(-50% + ${leftOffscreenMove}px)) translateY(18px);`;
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
    moveOutOfScreenAmount = 0;
    finalPosition = position;
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

    moveOutOfScreenAmount = moveAmount;
  }

  $: arrowPos = getArrowPos(component);

  function getArrowPos (...comp) : string {
    const topOffscreenMove = ["top", "bottom"].includes(position) ? 0 : -moveOutOfScreenAmount;
    const leftOffscreenMove = ["left", "right"].includes(position) ? 0 : -moveOutOfScreenAmount;

    switch (finalPosition) {
      case "left": return `right: -8px; top: calc(50% - 8px - ${topOffscreenMove}px); transform: rotate(45deg);`;
      case "right": return `left: -8px; top: calc(50% - 8px - ${topOffscreenMove}px); transform: rotate(45deg);`;
      case "top": return `bottom: -8px; left: calc(50% - ${leftOffscreenMove}px); transform: translateX(-8px) rotate(45deg);`;
      case "bottom": return `top: -8px; left: calc(50% - ${leftOffscreenMove}px); transform: translateX(-8px) rotate(45deg);`;
    }
  }

  let hiddenClass = "";
  $: hiddenClass = showing ? "" : "opacity-0";

</script>

{#if visible}
  <!-- Position tester - spawns before the visible one to see if it is out of the screen -->
  <div class="absolute whitespace-pre-wrap text-left" style="{anchorPos}">
    <div class="fixed px-3 py-1 rounded
    w-max max-w-sm font-sans" style="visibility: hidden; {offset}" bind:this={positionTesterComponent}>
      {tooltipContent}
    </div>
  </div>
{/if}

{#if showing}
  <div class="absolute whitespace-pre-wrap text-left opacity-100
  transition-all duration-200 delay-200 {hiddenClass}" transition:fade|global={{ duration: 120 }} style="{anchorPos}">
    <div class="fixed z-50 px-3 py-1 rounded bg-norbalt-200
    w-max max-w-sm font-sans shadow" style="{offset}" bind:this={component}>
      <div class="bg-norbalt-200 origin-center
      w-4 h-4 rounded-sm absolute -z-10" style="{arrowPos}"/>
      {tooltipContent}
    </div>
  </div>
{/if}

<svelte:window bind:innerWidth={maxWidth}/>
