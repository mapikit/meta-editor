import { ActionReturn } from "svelte/action";

export function clickOutside (node : HTMLElement)
  : ActionReturn<HTMLElement, { "on:click_outside" : (node : HTMLElement) => void; }> {

  const handleClick = (event : MouseEvent) : void => {
    if (node && !node.contains(event.target as HTMLElement) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent<HTMLElement>("click_outside", { detail: node }));
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy () {
      document.removeEventListener("click", handleClick, true);
    },
  };
}
