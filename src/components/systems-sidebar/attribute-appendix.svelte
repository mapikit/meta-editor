<script lang="ts">
import { guideText } from "../../stores/layout-tabs-store";
import SystemProp from "./system-prop.svelte";
import { cubicInOut } from "svelte/easing";


let hovered = "default";
export let visible = false;

const onHover = (data : CustomEvent<any>) => {
  hovered = data.detail.hovered;
  guideText.set(data.detail.message);
}

const onHoverOut = () => {
  hovered = "default";
  guideText.set("Select one of the three icons to start configuring your system. Hover to see more info about each one of them.")
}

const slideInTransition = (node, {}) => {
  return {
    duration: 150,
    css: t => `width: ${65 * cubicInOut(t)}px; opacity: ${cubicInOut(t)};`
  }
}

</script>

<div class="{visible ? "ugly-parent-css-hack" : "ugly-parent-css-hack"}">
  <div class="{"holder " + hovered}"
  transition:slideInTransition="{{}}"
  >
    <SystemProp buttonName={"schema"}
      on:hoverIn={onHover}
      on:hoverOut={onHoverOut}
    />
    <SystemProp buttonName={"bops"}
      on:hoverIn={onHover}
      on:hoverOut={onHoverOut}
    />
    <SystemProp buttonName={"protocols"}
      on:hoverIn={onHover}
      on:hoverOut={onHoverOut}
    />
  </div>
</div>

<style lang="scss">
.ugly-parent-css-hack {
  position: absolute;
  top: 26px;
  right: 0px;
  z-index: 3;
}

.holder {
  position: fixed;
  transition: all 250ms;
  width: 65px;
  background-color: #2c2c44;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-end;
  border-radius: 0 12px 12px 0;
  padding: 6px 6px 12px 6px;
  overflow: hidden;

  &.default {
    background-color: #2c2c44;
  }

  &.schema {
    background-color: #5d8efe;
  }

  &.bops {
    background-color: #fde084;
  }

  &.protocols {
    background-color: #ff5c8e;
  }
}

</style>
