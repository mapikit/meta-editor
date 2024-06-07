<script lang="ts">
  import { globalHeaderStore } from "../../../entities/stores/global-header-store";
  import { IconToolboxData, ToolboxAction } from "../../../entities/models/view-related/icon-toolbox";
  import { Toolbox } from "phosphor-svelte";
  import IconToolbox from "./icon-toolbox.svelte";
  import { NotificationData, notificationManager } from "../../components/notifications/notification-center";
  import { writable } from "svelte/store";

  let { title } = globalHeaderStore;
  let scroller : HTMLElement;
  let scrollAmount = writable(0);

  const testToolboxItem = new IconToolboxData(Toolbox, "Developer Toolbox Test here");
  let act = new ToolboxAction(
    "Test Notification",
    "Just spanws a notification to test the notification system",
    () => {
      notificationManager.notify(new NotificationData("debug", "Hey there!", "I'm a fancy notification."));
    },
  );

  testToolboxItem.actions.push(act);
</script>

<div class="flex px-2 justify-center items-center w-full h-full">
  <div class="flex-1 w-full flex items-center gap-1 overflow-x-scroll scroll-fade"
  on:scroll={() => { scrollAmount.set(scroller.scrollLeft); }}
  bind:this={scroller}>
    <IconToolbox toolboxData={testToolboxItem} scrollAmount={scrollAmount}/>
  </div>
  <div class="relative h-full w-full flex-1 flex items-center
  justify-self-center justify-center max-w-[min(50%_,_24rem)]">
    <h1 class="font-[Livvic] text-norbalt-100 font-bold delay-200 transition select-none
    overflow-ellipsis whitespace-nowrap overflow-clip mr-8"> {$title} </h1>
  </div>
  <div class="flex-1 w-full">
  </div>
</div>
