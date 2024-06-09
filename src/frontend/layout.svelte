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
  <slot name="content"></slot> <!-- content -->
</div>

<!-- Sidebar (Selector) -->
<aside class="bg-norbalt-400 h-[calc(100%_-_48px)] w-12 fixed left-0 top-12 flex flex-col justify-start items-center">
  <slot name="sidebar"></slot>
  <!-- icons list goes here -->
  <div class="flex-[10]"/> <!-- Middle Separator -->
  <NotificationTray />
  <div class="h-3"/>
</aside>

<section class="w-full top-0 bg-norbalt-500 h-12 flex items-center fixed"> <!-- HEADER (TOPBAR) -->
  <div class="w-12 h-full flex items-center">
    <button class="w-10 h-7 ml-1 mb-1" on:click={() => navigation.navigateTo("/")}> <!-- Icon holder-->
      <MetaSystemIcon width={1.6} />
    </button>
  </div>
  <slot name="header"></slot>
</section>

<NotificationStack />
