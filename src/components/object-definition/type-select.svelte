<script lang="ts">
  import { typeColors } from "../../common/styles/type-colors";
  let collapsed = true;
  export let currentType = "string";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const availableOptions = Object.keys(typeColors);
  const dispatch = createEventDispatcher();

  const changeType = (type) => {
    dispatch("typeChange", type);
    currentType = type;
    collapsed = true;
  }

</script>

<div class="selector" on:blur="{() => { collapsed = true }}">
  <div class="current-type" on:click="{() => { collapsed = !collapsed }}">
    <div class="type-circle" style="background-color: {typeColors[currentType]};"/>
    <div class="{collapsed ? "chevron-collapse" : "chevron-collapse down"}">
      <img src="/icon-chevron-up.svg" alt="chevron"/>
    </div>
  </div>
  {#if !collapsed}
  <div class="options-holder" transition:fade="{{ duration: 90}}">
    <div class="options">
      {#each availableOptions as option }
        <div class="option" on:click="{() => {changeType(option)}}">
          <div class="type-circle" style="background-color: {typeColors[option]};"/>
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