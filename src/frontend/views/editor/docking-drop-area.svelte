<script lang="ts">
	import { Readable, get } from "svelte/store";
	import DropArea from "../../components/drag-n-drop/drop-area.svelte";
  import { SubdivisionStore } from "../../../entities/stores/dock-subdivision-store";
	import { DragElement } from "src/frontend/components/drag-n-drop/default-drag-context";

  export let position : "top" | "bottom" | "left" | "right" | "horizontal" | "vertical" = "left";
  export let parent : SubdivisionStore;
  export let onDrop : (dragged : SubdivisionStore) => void = () => {};

  let { depth } = parent;

  // eslint-disable-next-line max-lines-per-function
  const computeMargin = () : number => {
    const baseMargin = -6;
    const marginMultiplicator = 6;
    let currentParent = parent;
    let finalMargin = baseMargin;

    const dropAreaRules = currentParent.getDropAreaRules();

    for (let currentDepth = $depth; currentDepth > 0; currentDepth --) {
      const parentUsesPosition : Record<string, Readable<boolean>> = {
        "top": dropAreaRules.showTopDropArea,
        "bottom": dropAreaRules.showBottomDropArea,
        "left": dropAreaRules.showLeftDropArea,
        "right": dropAreaRules.showRightDropArea,
      };

      finalMargin += Number(get(parentUsesPosition[position])) * marginMultiplicator;
    }

    return finalMargin;
  };

  let validOver = false;

  const sizingStyle = ["top", "bottom", "horizontal"].includes(position)
    ? "w-full h-4" : "h-full w-4";
  const positionStyle = ["vertical", "horizontal"].includes(position) ? ""
    :  position === "top" ? "top-0 left-0"
      : position === "bottom" ? "bottom-0 left-0"
        : position === "left" ? "left-0 top-0"
          : "right-0 top-0";

  const paddingStyle = ["top", "bottom", "horizontal"].includes(position) ? "px-1 py-[7px]" : "py-1 px-[7px]";
    // const getHoverStyle
  const cssStyle = ["vertical", "horizontal"].includes(position)
    ? "" : `margin-${position}: ${(computeMargin()) - 6}px`;
  let validOverStyle;

  $: {
    validOverStyle = validOver ? "cursor-cell backdrop-brightness-200" : "";
  }

  const dropFunction = (dragged : DragElement) : void => {
    onDrop(dragged.data as SubdivisionStore);
  };
</script>

<DropArea
  useContext="dockContext"
  style="absolute z-20 {validOverStyle} {sizingStyle} {positionStyle} {paddingStyle}"
  overrideStyle={true}
  acceptTypes={["docked_view"]}
  onAcceptedDragOver={() => {validOver = true;}}
  onAcceptedDragOut={() => {validOver = false;}}
  shouldHighlight={false}
  cssStyle={cssStyle}
  onDropContent={dropFunction}
>
  <div class="w-full rounded-lg h-full {validOver ? "bg-brightGreen" : ""} transition-all duration-150"
  />
</DropArea>
