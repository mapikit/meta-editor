<script lang="ts">
  import ChevronIcon from "../../../icons/chevron-icon.svelte";
  import { fade } from "svelte/transition";

  export let subtype = [];
  export let propValue = undefined;
  export let updateFunction = () => {};

  let collapsed = true;
  let displayText = "Select an option";
  let hasPropValue = Boolean(propValue);
  let hasAvailableOptions = subtype.length > 0;

  $: {
    displayText = propValue ? propValue : "Select an option";
    hasPropValue = Boolean(propValue);
    hasAvailableOptions = subtype.length > 0;
  }

  $: noSelectedColor = hasPropValue ? "text-white" : "text-offWhite";
  $: chevronSelecting = collapsed ? "" : "rotate-180";
</script>

<div class="flex-1 bg-norbalt-300 border rounded border-norbalt-100 hover:border-offWhite h-6 transition-all">
  <div
    class="relative px-2 {noSelectedColor} w-full flex flex-row justify-between items-center stroke-offWhite hover:stroke-white cursor-pointer"
    on:click="{() => { collapsed = !collapsed; }}"
  >
    <p> {displayText} </p>
    <div class="{chevronSelecting} transition-all">
      <ChevronIcon style="stroke-inherit transition-all" />
    </div>
    {#if !collapsed}
    <div class="absolute bg-norbalt-200 w-full top-7 left-0 rounded shadow text-white z-10" transition:fade={{ duration: 90 }}>
      <div class="">
        {#if hasAvailableOptions}
          {#each subtype as enumOption }
          <p class="px-3 py-0.5 first:pt-1.5 first:rounded-t last:pb-1.5 last:rounded-b hover:bg-norbalt-100 transition-all cursor-pointer" on:click="{() => {
            propValue = enumOption;
            updateFunction();
          }}">
            {enumOption}
          </p>
          {/each}
        {:else}
          <p class="px-3 py-0.5 first:pt-1.5 first:rounded-t last:pb-1.5 last:rounded-b text-offWhite cursor-default">
            No options available
          </p>
        {/if}
      </div>
    </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .chevron-collapse {
    width: 10px;
    height: 10px;
    margin-top: 2px;
    margin-right: 6px;
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

  .value-input {
    padding: 4px;
    background-color: #323248;
    border-radius: 0 0px 6px 6px;

    .select {
      position: relative;
      width: 100%;
      font-family: 'Dosis';
      background-color: transparent;
      border: none;
      outline: none;
      font-size: 16px;
      color: white;
      padding-left: 6px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      height: 20px;

      &.void {
        color: #ffffff5d;
      }
    }
  }

  .options-holder {
    z-index: 5;
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
  }

  .options {
    transform: translateX(-100%);
    border-radius: 6px;
    position: fixed;
    background-color: #323248;
    // padding: 6px 12px;
    box-shadow: 0 0 9px -2px rgba(0, 0, 0, 0.808);
    // width: calc(100% - 60px);
  }

  .option {
    padding: 2px 12px;
    cursor: pointer;
    display: grid;
    align-items: center;
    column-gap: 8px;
    transition: 60ms;

    &.void {
      color: #ffffff5d;
      cursor: default;

      &:hover {
        background-color: #323248;
      }
    }

    &:first-child {
      padding-top: 6px;
      border-radius: 6px 6px 0 0;
    }

    &:last-child {
      padding-bottom: 6px;
      border-radius: 0 0 6px 6px;
    }

    &:not(:first-child) {
      margin-top: 3px;
    }

    &:hover {
      background-color: #46465a;
    }
  }
</style>