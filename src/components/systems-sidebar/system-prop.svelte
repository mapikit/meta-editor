<script lang="ts">
import SchemaIcon from "../common/icons/schema-icon.svelte";
import { createEventDispatcher } from 'svelte';
import BopsIcon from "../common/icons/bops-icon.svelte";
import ProtocolsIcon from "../common/icons/protocols-icon.svelte";
import { fly } from "svelte/transition";

const dispatch = createEventDispatcher();

export let buttonName = "";
let hovered = false;

const availableButtons = {
  "schema": { icon: SchemaIcon, primaryColor: "#5d8efe", message: "Schemas defines the data on your system", tooltip: "Schemas" },
  "protocols": { icon: ProtocolsIcon, primaryColor: "#ff5c8e", message: "Protocols opens your system to the outside world.", tooltip: "Protocols" },
  "bops": { icon: BopsIcon, primaryColor: "#fde084", message: "Business operations are the processes required for your system to work.", tooltip: "Business Operations" }
};

const hoverIn = () => {
  dispatch("hoverIn", {
    hovered: buttonName,
    message: availableButtons[buttonName].message,
  });

  hovered = true;
};

const hoverOut = () => {
  dispatch("hoverOut", {
    hovered: buttonName
  });

  hovered = false;
};

</script>

<div class="{`propicon ${hovered ? "hover" : ""}`}"
  on:mouseenter="{hoverIn}"
  on:mouseleave="{hoverOut}"
>
  <svelte:component
    this={availableButtons[buttonName]?.icon}
    centerColor={hovered ? "#13131f" : availableButtons[buttonName]?.primaryColor}
    outColor={hovered ? "#13131f" : "white"}
  />
  {#if hovered}
    <div class="p-holder">
      <p transition:fly={{ x: -12, duration: 250 }}>
        {availableButtons[buttonName].tooltip}
      </p>
    </div>
  {/if}
</div>

<style lang="scss">
.propicon {
  transition: all 250ms;
  border-radius: 50%;
  background-color: #13131f;
  margin-top: 16px;
  width: 46px;
  height: 46px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;

  &.hover {
    background-color: white;
  }

  .p-holder {
    position: absolute;
    top: 25px;
    right: 12px;
  }

  p {
    position: fixed;
    white-space: nowrap;
    text-align: right;
    background-color: white;
    padding: 4px 12px;
    border-radius: 18px;
  }
}

</style>