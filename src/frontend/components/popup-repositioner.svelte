<script lang="ts">
  // Due to the nature of this solution, it breaks the svelte transitions because it
  // overides the style for the component in the slot

  import { onMount } from "svelte";

  type PopupPosition = "bottom" | "top" | "left" | "right";

  export let popupPosition : PopupPosition = "bottom";

  let positionedItemParent : Element = null;
  let positionedItem : Element = null;

  const computeFinalPositionClass = () : string => {
    return finalPosition === "bottom" ? "top-full"
      : finalPosition === "top" ? "top-0"
        : finalPosition === "right" ? "left-full" : "left-0";
  };

  let movedOutOfScreenAmount = 0;
  let shouldFlip = false;
  let finalPosition : PopupPosition = popupPosition;
  let finalPositionClass = computeFinalPositionClass();

  $: {
    positionedItem = positionedItemParent !== null ? positionedItemParent.firstElementChild : null;
  }

  onMount(() => {
    positionedItem = positionedItemParent !== null ? positionedItemParent.firstElementChild : null;
    reposition();
  });

  // eslint-disable-next-line max-lines-per-function
  const reposition = () : void => {
    const rect = positionedItem?.getBoundingClientRect();
    if (!rect) { return; }

    // Computes movement amount
    const windowInfo = { width: window.innerWidth, height: window.innerHeight };
    shouldFlip = false;
    let moveAmount = 0;
    movedOutOfScreenAmount = 0;
    finalPosition = popupPosition;
    let securityMargin = 6;

    if (["left", "right"].includes(popupPosition)) {
      shouldFlip = popupPosition === "left"
        ? rect.x <= 0
        : rect.right >= windowInfo.width;

      moveAmount = rect.y <= 0 ? rect.y - securityMargin
        : rect.bottom >= windowInfo.height
          ? rect.bottom - windowInfo.height + securityMargin : 0;

    } else {
      shouldFlip = popupPosition === "top"
        ? rect.y <= 0
        : rect.bottom >= windowInfo.height;

      moveAmount = rect.x <= 0 ? rect.x - securityMargin
        : rect.right >= windowInfo.width
          ? rect.right - windowInfo.width + securityMargin : 0;
    }

    if (shouldFlip) {
      switch (popupPosition) {
        case "top": finalPosition = "bottom"; break;
        case "bottom": finalPosition = "top"; break;
        case "left": finalPosition = "right"; break;
        case "right": finalPosition = "left"; break;
      }
    }

    movedOutOfScreenAmount = moveAmount;

    if (!shouldFlip && moveAmount === 0) { return; }
    // Modifies Style
    finalPositionClass = computeFinalPositionClass();
    setFinalStyle();
  };


  const setFinalStyle = () : void => {
    const flippedClassValue = finalPosition === "bottom" ? ""
      : finalPosition === "top" ? "translateY(-100%)"
        : finalPosition === "right" ? "" : "translateX(-100%)";

    const slideAxis : "x" | "y" = ["bottom" , "top"].includes(finalPosition) ? "x" : "y";
    const slideStyleValue = slideAxis === "x" ? `translateX(-${movedOutOfScreenAmount}px)`
      : `translateY(-${movedOutOfScreenAmount}px)`;

    positionedItem.setAttribute("style", `transform: ${slideStyleValue} ${flippedClassValue}`);
  };
</script>

<div class="relative h-full w-full {finalPositionClass}"
  bind:this={positionedItemParent}>
  <slot ></slot>
</div>
