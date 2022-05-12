<script lang="ts">
import { navigation } from "../../lib/navigation";

// Logo on the left
// After the logo, Breadcrumbs
// Right sandwich menu

import { selectedService } from "../../stores/layout-tabs-store";
import { selectedSystem } from "../systems-sidebar/systems-stores";
</script>

<div class="header">
  <div class="logo" on:click="{() => { navigation.navigateTo('/'); selectedService.set(""); }}" >
    <img src="/logo-and-name.svg" alt="mapikit-logo"/>
  </div>
  {$selectedSystem}
</div>

<style lang="scss">
  .header {
    background-color: #0e0e16;
    width: 100%;
    height: 48px;
    position: fixed;

    .logo {
      height: 36px;
      margin-top: 11px;
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>