<script lang="ts">
  import Tooltip from "./tooltip.svelte";
  import { fly } from "svelte/transition";

  export let selected : string;
  export let service : { name : string; link : string; icon : string; tooltip : string; };
  export let selectFunction : (name : string) => void;

  let visible = false;

</script>

<div class="service-holder">
  <div
    class="{selected === service.name ? "service selected" : "service"}"
    on:click="{() => selectFunction(service.name)}"
    on:mouseenter="{() => visible = true}"
    on:mouseleave="{() => visible = false}"
  >
    <Tooltip tooltipContent="{service.tooltip}" visible={visible} position={"right"}/>
    <img alt={service.name} src={"/dashboard-assets/icons/"+service.icon}/>
  </div>
  {#if selected === service.name}
    <div class="selected-mark" transition:fly|local="{{ x: 10, duration: 250 }}"/>
  {/if}
</div>

<style lang="scss">

.service {
    position: relative;
    cursor: pointer;
    height: 56px;
    width: 56px;
    background-color: #6d3afc;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 200ms, border 100ms;

    img {
      width: 32px;
      height: 32px;
    }
  }

  .selected-mark {
    background-color: #3cf691;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    position: absolute;
    right: -5px;
    top: 23px;
    transform: rotate(45deg);
  }

  .service:hover {
    background-color: #a382ff;
  }

  .service.selected {
    border: 3px solid white;
  }

  .service-holder {
    position: relative;
    overflow: hidden;
    width: 100%;
  }

  .service-holder:not(:first-child) {
    margin-top: 16px;
  }
</style>
