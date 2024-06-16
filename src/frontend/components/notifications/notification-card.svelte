<script lang="ts">
  import { X } from "phosphor-svelte";
  import { NotificationData, NotificationLocation, notificationManager } from "./notification-center";
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { formatDistance } from "date-fns";
  import CardButton from "../buttons/card-button.svelte";

  export let notification : NotificationData;

  const { location } = notification;
  let hovered = false;
  let notificationOutlineMap : Record<NotificationData["type"], string> = {
    "debug": "outline-royalBlue",
    "warn": "outline-ochreYellow",
    "error": "outline-roseRed",
    "info": "outline-norbalt-200",
  };

  let notificationProgressColorMap : Record<NotificationData["type"], string> = {
    "debug": "bg-royalBlue",
    "warn": "bg-ochreYellow",
    "error": "bg-roseRed",
    "info": "bg-norbalt-100",
  };

  let stackDisplay = $location !== NotificationLocation.STACK;

  $: {
    stackDisplay = $location !== NotificationLocation.STACK;
  }
  onMount(() => {
    if (stackDisplay) { return; }
    notification.ticking.subscribe(ticking => {
      if (get(notification.finished)) { return; }
      progressScale = ticking ? "0%" : "100%";
      durationTimeout = ticking ? `${notification.durationMs}ms` : "0ms";
    });
    notification.startTimer();
  });

  let progressScale = "100%";
  let durationTimeout = `${notification.durationMs}ms`;

  const closeButtonPress = () : void => {
    if ($location === NotificationLocation.DISMISSED) {
      notificationManager.clearOne(notification);
      return;
    }

    if ($location === NotificationLocation.PENDING) {
      notificationManager.dismissPending(notification);
      return;
    }

    notificationManager.dismissVisible(notification);
  };

  const buttonTheme = (type : NotificationData["type"]) : CardButton["$$prop_def"]["hoverColor"] => {
    const colorDict : Record<NotificationData["type"], CardButton["$$prop_def"]["hoverColor"]> = {
      "debug": "blue",
      "error": "red",
      "info": "default",
      "warn": "yellow",
    };

    return colorDict[type];
  };
</script>

<!-- Just an effect, no aria role needed -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="relative rounded outline outline-2 {notificationOutlineMap[notification.type]} bg-norbalt-300 shadow
py-3 px-4 mt-3 max-w-3xl {stackDisplay ? "w-[calc(100%-4px)] ml-0.5" : "w-fit"} pointer-events-auto"
  on:mouseenter={() => { hovered = true; !stackDisplay && notification.stop(); }}
  on:mouseleave={() => { hovered = false; !stackDisplay && notification.startTimer();}}
  transition:fly|global={{ x: -50, y: 0, duration: 250 }}
>
  <button class="absolute top-1 right-1 p-1 hover:bg-norbalt-200 bg-transparent transition duration-150 rounded"
    on:click={closeButtonPress}
  >
    <X class="{hovered ? "opacity-100" : "opacity-0"} transition duration-200"/>
</button>
  <p class="text-offWhite text-sm">
    {formatDistance(notification.timestamp, new Date(Date.now()), { addSuffix: true })} </p>
  <h1 class="text-lg font-[Livvic] font-bold"> {notification.title} </h1>
  <p class="mt-1">{notification.description} </p>
  {#if !stackDisplay}
  <div class="w-full flex flex-row-reverse mt-3 -mr-2">
    {#each notification.buttonActions as button }
      <CardButton clickFunction={button.call} class="w-fit px-2" hoverColor={buttonTheme(button.type)}>
        {button.text}
      </CardButton>
    {/each}
  </div>
  {/if}
  {#if notification.durationMs && notification.durationMs > 0 && !stackDisplay}
    <div class="{notificationProgressColorMap[notification.type]}
    absolute bottom-0 w-full h-1 left-0 origin-left"
    style="transform: scaleX({progressScale}); transition-duration: {durationTimeout};"/>
  {/if}
</div>
