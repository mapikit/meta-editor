<script lang="ts">
  import Tooltip from "./tooltip.svelte";
  import { fly } from "svelte/transition";

  export let selected : string;
  export let service : { name : string; link : string; icon : string; tooltip : string; };
  export let selectFunction : (name : string) => void;

  let visible = false;
  let selectedClass = "";

  $: selectedClass = selected === service.name ? "bg-norbalt-100" : "";
</script>

<div class="w-full h-20 relative flex justify-center items-center cursor-pointer overflow-hidden {selectedClass}">
  <div
    class="bg-norbalt-300 h-16 w-16 rounded-lg flex justify-center items-center hover:bg-norbalt-400 transition-all"
    on:click="{() => selectFunction(service.name)}"
    on:mouseenter="{() => visible = true}"
    on:mouseleave="{() => visible = false}"
  >
    <Tooltip tooltipContent="{service.tooltip}" visible={visible} position={"right"}/>
    <img alt={service.name} src={"/dashboard-assets/icons/"+service.icon} class="w-10 h-10"/>
  </div>
  {#if selected === service.name}
    <div class="bg-brightGreen w-1.5 h-1/3 absolute right-0 top-0 translate-y-[100%] rounded-l-sm" transition:fly="{{ x: 10, duration: 250 }}"/>
    <div class="bg-brightGreen w-1.5 h-1/3 absolute left-0 top-0 translate-y-[100%] rounded-l-sm" transition:fly="{{ x: -10, duration: 250 }}"/>
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
</style>
