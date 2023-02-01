<script lang="ts">
  import type { ArchitectContext } from "../../entities/auxiliary-entities/architect-context";
  import { getContext, onDestroy, onMount } from "svelte";
  import type { CanvasUtils } from "./canvas-utils";
  import type { UIBusinessOperation } from "../../entities/business-operation";
  import { connectionsManager } from "./helpers/connections-manager";
  import type { DrawableConnection } from "./helpers/module-connection";
  import { clickOutside } from "./helpers/click-outside";

  const currentBop = getContext<UIBusinessOperation>("currentBop");
  const architectContext = getContext<ArchitectContext>("architectContext");
  const canvasContext = getContext<CanvasUtils>("canvasContext");
  const { mousePos } = architectContext;
  const { configuration } = currentBop;

  $: inCuttingRange = $mousePos && canvasContext
    .getInCuttingRange(connectionsManager.getFilteredConnections(), $mousePos);
  

  const styleDrawableStroke = (drawable : DrawableConnection) : DrawableConnection => {
    return { ...drawable,
      strokeStyle : { thickness: 3, stroke: "#ea6e91", dash: [12, 5] },
    };
  };
  
  let unsub;
  onMount(() => {
    unsub = mousePos.subscribe(() => {
      canvasContext.redrawConnections([], inCuttingRange.map((el) => el.getDrawable()).map(styleDrawableStroke));
    });
  });

  onDestroy(() => {
    unsub();
    canvasContext.redrawConnections();
  });

  const removeDepsCut = () : void => {
    inCuttingRange.forEach((connection) => currentBop.removeDependency(connection));
    connectionsManager.refreshConnections($configuration);
    canvasContext.redrawConnections();
  };
</script>

<div class="opacity-0 w-0 h-0" use:clickOutside on:outclick={removeDepsCut}>

</div>