export function clickOutside (node : Node) : { destroy : () => void } {
  const handleClick = (event : MouseEvent) : void => {
    if (!node.contains(event.target as Node)) {
      node.dispatchEvent(new CustomEvent("outclick"));
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy () : void {
      document.removeEventListener("click", handleClick, true);
    },
  };
};
