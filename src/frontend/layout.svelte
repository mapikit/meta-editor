<script lang="ts">
  import { setContext } from "svelte";
  import NotificationStack from "./components/notifications/notification-stack.svelte";
  import NotificationTray from "./components/notifications/notification-tray.svelte";
  import MetaSystemIcon from "./icons/meta-system-icon.svelte";
  import { navigation } from "./lib/navigation";
  import { writable } from "svelte/store";

  const layoutStyling = writable("bg-global-bg-gradient");
  setContext("layout-style", layoutStyling);
</script>

<div class="mt-12 ml-12 p-1 {$layoutStyling} w-[calc(100%_-_48px)] h-[calc(100%_-_48px)] z-0 fixed">
  <slot></slot> <!-- content -->
</div>
<section class="w-full top-0 bg-norbalt-400 h-12 flex items-center p-1 fixed"> <!-- HEADER (TOPBAR) -->
  <button class="w-10 h-7" on:click={() => navigation.navigateTo("/")}> <!-- Icon holder-->
    <MetaSystemIcon width={1.6} />
  </button>
</section>

<!-- Sidebar (Selector) -->
<aside class="bg-norbalt-400 h-[calc(100%_-_48px)] w-12 fixed left-0 top-12 flex flex-col justify-start items-center">
  <!-- icons list goes here -->
  <div class="flex-[10]"/> <!-- Middle Separator -->
  <div class=""> <!-- Notification Tray -->
    <NotificationTray />
  </div>
  <div class="h-3"/>
</aside>



<NotificationStack />
