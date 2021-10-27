<script lang="ts">
import HeaderLinks from "./header-links.svelte";
import { fly } from "svelte/transition";

let visible = false;

const toggleVisibility = () => { visible = !visible; };
</script>

<div class="hamburger-container">
  <img class="icon" src="/hamburger-menu.svg" alt="hamburger menu icon" on:click={toggleVisibility}/>
  {#if visible}
    <div class="menu-elements" in:fly="{{ y: -50, duration: 200 }}" out:fly="{{ y: -50, duration: 200 }}">
      <HeaderLinks />
    </div>
  {/if}
</div>

<style lang="scss">
  .icon {
    height: 40px;
    margin-right: 8px;
    cursor: pointer;
  }

  .menu-elements {
    position: absolute;
    width: 280px;
    margin-top: 14px;
    box-shadow: 0 5px 6px rgba(0, 0, 0, 0.356);
    padding: 6px;
    border-radius: 6px;
    right: 8px;
    background-color: #171730;
  }
</style>