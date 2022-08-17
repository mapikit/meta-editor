<script lang="ts">
  import { typeColors } from "../../common/styles/type-colors";
  let collapsed = true;
  let subTypeCollapsed = true;
  export let currentType = "string";
  export let currentSubtype = undefined;
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import ChevronIcon from "../../icons/chevron-icon.svelte";
  import ArrowIcon from "../../icons/arrow-icon.svelte";

  const availableOptions = Object.keys(typeColors);
  const availableSubTypeOptions = availableOptions.filter((value) => {
    return value !== "array" && value !== "any" && value !== "enum";
  });
  const dispatch = createEventDispatcher();

  // eslint-disable-next-line max-lines-per-function
  const changeType = (type) => {
    if (type === "array") {
      dispatch("typeChange", type);
      currentType = type;
      subTypeCollapsed = false;

      return;
    }

    currentType = type;
    dispatch("typeChange", type);

    if (type === "object" || type === "enum") {
      changeSubType([]);
      return;
    }

    currentSubtype = undefined;
    collapsed = true;
  };

  // eslint-disable-next-line max-lines-per-function
  const changeSubType = (subtype) => {
    if (subtype === "object") {
      dispatch ("subTypeChange", {
        subtype: [],
        keyName: "Objects of Array",
        type: "object",
        value: {},
        required: true,
      });
      currentSubtype = subtype;
      collapsed = true;
      subTypeCollapsed = true;
      return;
    }

    dispatch("subTypeChange", subtype);
    currentSubtype = subtype;
    collapsed = true;
    subTypeCollapsed = true;
  };

  $: collapsedChevronStyle = collapsed ? "" : "rotate-180";
</script>

<div class="w-11 ml-2 rounded bg-norbalt-350 h-6 border border-norbalt-100 stroke-offWhite hover:stroke-white relative hover:border-offWhite transition-all" on:blur="{() => { collapsed = true; subTypeCollapsed = true; }}">
  <div class="flex flex-row items-center justify-center h-full w-11 cursor-pointer" on:click="{() => { collapsed = !collapsed; subTypeCollapsed = true; }}">
    <div class="transition-all rounded-full h-3 w-3" style="background-color: {typeColors[currentType]};"/>
    {#if currentSubtype !== undefined && typeof currentSubtype !== "object"}
      <div class="transition-all rounded-full h-3 w-3 -ml-1.5" style="background-color: {typeColors[currentSubtype]};"/>
    {:else if typeof currentSubtype === "object" && currentType === "array"}
      <div class="transition-all rounded-full h-3 w-3 -ml-1.5" style="background-color: {typeColors["object"]};"/>
    {/if}
    <div class="h-full w-3 flex items-center justify-center ml-1">
      <ChevronIcon style="stroke-inherit w-2 transition-all {collapsedChevronStyle}"/>
    </div>
  </div>
  {#if !collapsed && subTypeCollapsed}
    <div class="z-10 absolute top-[calc(100%_+_8px)]" transition:fade="{{ duration: 90 }}">
      <div class="w-32 rounded bg-norbalt-200 shadow">
        {#each availableOptions as option }
          <div class="transition-all duration-75 cursor-pointer grid flex-row grid-cols-[12px_calc(100%_-_16px)] gap-2 items-center px-3 py-0.5 first:pt-1.5 first:rounded-t last:pb-1.5 last:rounded-b hover:bg-norbalt-100 stroke-offWhite hover:stroke-white" on:click="{() => {changeType(option);}}">
            <div class="transition-all rounded-full h-3 w-3 mt-0.5 " style="background-color: {typeColors[option]};"/>
            {#if option !== "array"}
              <p> {option} </p>
            {:else}
              <p class="flex flex-row justify-between items-center"> {option}
                <ArrowIcon style="w-2.5 h-2.5 transition-all mt-1"/>
              </p>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}
  {#if !subTypeCollapsed}
    <div class="z-10 absolute top-[calc(100%_+_8px)]" transition:fly="{{ duration: 120, delay: 90, x: 20 }}">
      <div class="w-32 rounded bg-norbalt-200 shadow">
        {#each availableSubTypeOptions as option }
          <div class="transition-all duration-75 cursor-pointer grid flex-row grid-cols-[12px_calc(100%_-_16px)] gap-2 items-center px-3 py-0.5 first:pt-1.5 first:rounded-t last:pb-1.5 last:rounded-b hover:bg-norbalt-100 stroke-offWhite hover:stroke-white" on:click="{() => {changeSubType(option);}}">
            <div class="transition-all rounded-full h-3 w-3 mt-0.5 " style="background-color: {typeColors[option]};"/>
            <p> {option} </p>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .selector {
    position: relative;
    background-color: #171723;
    border-radius: 6px;
    width: 44px;

    .options-holder {
      z-index: 5;
      position: absolute;
      top: calc(100% + 4px);
      left: 50%;

      .options {
        transform: translateX(-50%);
        border-radius: 6px;
        position: fixed;
        background-color: #171723;
        // padding: 6px 12px;
        box-shadow: 0 0 5px -2px rgba(255, 255, 255, 0.301);
      }

      .option {
        padding: 2px 12px;
        cursor: pointer;
        display: grid;
        flex-flow: row nowrap;
        grid-template-columns: 12px calc(100% - 16px);
        align-items: center;
        column-gap: 8px;
        transition: 60ms;

        &:first-child {
          padding-top: 6px;
        }

        &:last-child {
          padding-bottom: 6px;
        }

        &:not(:first-child) {
          margin-top: 3px;
        }

        &:hover {
          background-color: #2e2e3f;
        }
      }
    }
  }

  .current-type {
    cursor: pointer;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .type-circle {
    width: 12px;
    height: 12px;
    background-color: chocolate;
    border-radius: 50%;
    transition: 150ms;

    &.subtype {
      margin-left: -6px;
      width: 14px;
      height: 14px;
      border: 1px solid #171723;
    }
  }

  .chevron-collapse {
    width: 10px;
    height: 10px;
    margin-top: 2px;
    margin-left: 4px;
    transform-origin: center;
    transform: rotate(180deg);
    transition: all 250ms;

    img {
      width: 80%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
      filter: brightness(100);
    }

    &.down {
      transform: rotate(0deg);
    }
  }
</style>