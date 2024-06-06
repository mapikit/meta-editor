<script lang="ts">
  import { fly, slide } from "svelte/transition";
  import { globalHeaderStore } from "../../entities/stores/global-header-store";
  import { IconToolboxData, ToolboxAction } from "../../entities/models/view-related/icon-toolbox";
  import { Toolbox } from "phosphor-svelte";
  import IconToolbox from "../components/icon-toolbox/icon-toolbox.svelte";
  import { NotificationData, notificationManager } from "../components/notifications/notification-center";


  let { title, openLocked } = globalHeaderStore;

  let toolbarOpen = true;
  let mouseoutDelayTimeout;
  let timeoutMs = 200;

  const testToolboxItem = new IconToolboxData(Toolbox, "ferramentas");
  let act = new ToolboxAction(
    "Test Notification",
    "Just spanws a notification to test the notification system",
    () => {
      notificationManager.notify(new NotificationData("debug", "Hey there!", "I'm a fancy notification."));
    },
  );

  testToolboxItem.actions.push(act);
</script>

<div class="flex justify-center items-center w-full h-full">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="relative h-full flex items-center justify-center group w-fit max-w-[min(50%_,_24rem)]"
  on:mouseenter={() => {
    toolbarOpen = true;
    if (mouseoutDelayTimeout) clearTimeout(mouseoutDelayTimeout);
  }}
  on:mouseleave={() => {
    mouseoutDelayTimeout = setTimeout(() => {
      toolbarOpen = false;
      mouseoutDelayTimeout = undefined;
    }, timeoutMs);
  }}
  >
    <h1 class="text-2xl font-[Livvic] text-norbalt-100 font-bold
    group-hover:text-white delay-200 group-hover:delay-0 transition select-none
    overflow-ellipsis whitespace-nowrap overflow-clip"> {$title} </h1>
    <div class="absolute w-14 bottom-1 h-[3px] rounded bg-norbalt-200
    transition-all group-hover:translate-y-2 delay-200 group-hover:delay-0 group-hover:opacity-0"/>
    {#if toolbarOpen || $openLocked}
      <div class="absolute bg-norbalt-300 shadow rounded outline outline-2 outline-norbalt-200
      -bottom-2 translate-y-full mt-2 h-12 flex items-center"
      transition:fly={{ x:0, y: -20 , duration: 200, delay: 50 }}>
        <IconToolbox toolboxData={testToolboxItem}/>
        <!-- <IconToolbox toolboxData={testToolboxItem}/> -->
      </div>
    {/if}
  </div>
</div>
