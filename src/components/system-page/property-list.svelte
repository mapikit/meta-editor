<script lang="ts">
import BopsIcon from "../common/icons/bops-icon.svelte";
import ProtocolsIcon from "../common/icons/protocols-icon.svelte";
import SchemaIcon from "../common/icons/schema-icon.svelte";
import { fade } from "svelte/transition";
import SystemPropCard from "./system-prop-card.svelte";
import PlusSignBoxIcon from "../common/icons/plus-sign-box-icon.svelte";
import { fly } from "svelte/transition";
import { navigation } from "../../lib/navigation";
import { selectedSystem } from "../systems-sidebar/systems-stores";
import type { PropertyListEntry } from "../../common/types/property-list-entry";

export let listType : keyof typeof typeInfos = "schemas";
export let listData : PropertyListEntry[] = [];
export let createNewEntryHandler : () => void;

const typeInfos = {
  "schemas": { color: "#5d8efe", label: "Schemas", icon: SchemaIcon, contentCard: "" },
  "bops": { color: "#fde084", label: "Business Operations", icon: BopsIcon },
  "protocols": { color: "#ff5c8e", label: "Protocols", icon: ProtocolsIcon },
};

const listInfo = typeInfos[listType];

let isOpen = false;

navigation.pathStore.subscribe((newValue) => {
  const pathSteps = newValue.split("/");
  isOpen = pathSteps[4] === listType;
});

let createHovered = false;

const getNavPath = () : string => {
  return `/mapibox/system/${$selectedSystem}/${listType}/`;
};
</script>

<div class="prop-container">
  <div class="title" on:click={() => { navigation.navigateTo(getNavPath()); }}>
    <div class="{!isOpen ? "chevron-collapse" : "chevron-collapse down"}">
      <img src="/icon-chevron-up.svg" alt="chevron"/>
    </div>
    {#if isOpen}
      <div class={"highlight-detail"} style={`background-color: ${listInfo.color}`}
        transition:fade={{ duration:150 }}
      ></div>
    {/if}
    <div class="icon">
      <svelte:component
        this={listInfo.icon}
        centerColor={isOpen ? listInfo.color : "#2c2c44"}
        outColor="white"
      />
    </div> <p>{listInfo.label}</p>
  </div>
  {#if isOpen}
    <div class="list-container" style={`border-left-color: ${listInfo.color}`}>
      {#each listData as listItem, index }
        <div in:fly={{ x: 20, delay: index * 46 }} out:fly={{ x: 20, delay: 50*(listData.length - 1 * index) }}>
          <SystemPropCard entry={listItem}/>
        </div>
      {/each}
    </div>
    <div class="button-spacer" style={`background-color: ${listInfo.color}`}/>
    <div class="add-new" style={`--hover-color: ${listInfo.color}`}
      on:click={createNewEntryHandler}
      on:mouseenter={() => { createHovered = true; }}
      on:mouseleave={() => { createHovered = false; }}
    >
      <span class="add-icon" >
        <PlusSignBoxIcon scale={1} iconColor={createHovered ? listInfo.color : "white" }/>
      </span> Create New {listInfo.label}
    </div>
  {/if}
</div>

<style lang="scss">
  .list-container {
    border-left-width: 2px;
    border-left-style: solid;
    margin-left: 28px;
    padding: 6px 10px 26px 10px;
  }

  .add-new {
    cursor: pointer;
    margin-left: 62px;
    margin-top: -11px;
    font-family: 'Dosis';
    font-weight: 500;
    font-size: 18px;
    transition: 200ms all;

    display: flex;

    &:hover {
      color: var(--hover-color);
    }
  }

  .button-spacer {
    height: 2px;
    width: 22px;
    margin-left: 28px;
  }

  .prop-container {
    &:not(:first-child) {
      margin-top: 24px;
    }

    .title {
      cursor: pointer;
      position: relative;
      border-radius: 12px;
      width: 480px;
      font-size: 30px;
      font-family: 'Dosis';
      text-align: center;
      overflow: hidden;
      background-color: #1a1a2a;
      transition: 200ms;

      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      padding: 8px;

      & .icon {
        padding-top: 8px;
        margin-right: 6px
      }

      &:hover {
        background-color: #2c2c44;
      }
    }
  }

  .highlight-detail {
    width: 10px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .chevron-collapse {
    position: absolute;
    width: 20px;
    height: 20px;
    margin-top: 2px;
    margin-left: 4px;
    transform-origin: center;
    transform: rotate(90deg);
    transition: all 250ms;
    align-self: center;
    left: 16px;

    img {
      width: 80%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
      filter: brightness(100);
    }

    &.down {
      transform: rotate(180deg);
    }
  }

  .add-icon {
    // padding-top: 1px;
    margin-right: 6px;
  }
</style>