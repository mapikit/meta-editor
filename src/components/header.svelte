<script lang="ts">
import { onMount } from "svelte";
import HamburgerMenu from "./hamburger-menu.svelte";
import HeaderLinks from "./header-links.svelte";

let screenSize : number = 0;

const setScreen = (num : number) => {
  screenSize = num;
}

onMount(() => {
  setScreen(window.screen.width);
})

$: isSmallScreen = screenSize < 480;

</script>
<svelte:window on:resize={(e) => setScreen(e.currentTarget.screen.width)}/>

<div class="header-container">
  {#if !isSmallScreen}
    <HeaderLinks />
  {:else}
    <HamburgerMenu />
  {/if}
</div>

<style>
  .header-container {
    height: 52px;
    background-color: #171730;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center;
  }
</style>