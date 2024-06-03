import { ActionReturn } from "svelte/action";

// eslint-disable-next-line max-lines-per-function
export function clickOutside (node : HTMLElement)
  : ActionReturn<HTMLElement, {"on:click_outside" : (node : HTMLElement) => void;}> {
  let downInside = false;

  const handleClick = (event : MouseEvent) : void => {
    if (node && !node.contains(event.target as HTMLElement) && !event.defaultPrevented && !downInside) {
      node.dispatchEvent(new CustomEvent<HTMLElement>("click_outside", { detail: node }));
    }

    downInside = false;
  };

  const handleMouseDown = (event : MouseEvent) : void => {
    if (node && node.contains(event.target as HTMLElement)) {
      downInside = true;
    }
  };

  node.addEventListener("mousedown", handleMouseDown, true);
  document.addEventListener("click", handleClick, true);

  return {
    destroy () {
      node.removeEventListener("mousedown", handleMouseDown, true);
      document.removeEventListener("click", handleClick, true);
    },
  };
}
