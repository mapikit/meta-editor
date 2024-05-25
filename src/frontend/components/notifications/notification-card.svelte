<script lang="ts">
  import { X } from "phosphor-svelte";
  import { NotificationData, notificationManager } from "./notification-center";
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  export let notification : NotificationData;

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

  onMount(() => {
    notification.ticking.subscribe(ticking => {
      if (get(notification.finished)) { return; }
      progressScale = ticking ? "0%" : "100%";
      durationTimeout = ticking ? `${notification.durationMs}ms` : "0ms";
    });
    notification.startTimer();
  });

  let progressScale = "100%";
  let durationTimeout = `${notification.durationMs}ms`;
</script>

<!-- Just an effect, no aria role needed -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="relative rounded outline outline-2 {notificationOutlineMap[notification.type]} bg-norbalt-300 shadow
py-3 px-4 mt-3 max-w-3xl w-fit pointer-events-auto"
  on:mouseenter={() => { hovered = true; notification.stop(); }}
  on:mouseleave={() => { hovered = false; notification.startTimer();}}
  transition:fly|global={{ x: -50, y: 0, duration: 250 }}
>
  <button class="absolute top-1 right-1 p-1 hover:bg-norbalt-200 bg-transparent transition duration-150 rounded"
    on:click={() => { notificationManager.dismiss(notification); }}
  >
    <X class="{hovered ? "opacity-100" : "opacity-0"} transition duration-200"/>
</button>
  <h1 class="text-lg font-[Livvic] font-bold"> {notification.title} </h1>
  <p class="mt-1">{notification.description} </p>
  <div class="w-full flex flex-row-reverse mt-3 -mr-2">
    {#each notification.buttonActions as button }
      <button class="bg-norbalt-400 outline outline-2 outline-transparent hover:outline-norbalt-200
        transition-all duration-100 text-offWhite hover:text-white rounded px-2 py-0.5 ml-2
      "
        on:click={button.call}
      >
        {button.text}
      </button>
    {/each}
  </div>
  {#if notification.durationMs && notification.durationMs > 0}
    <div class="{notificationProgressColorMap[notification.type]}
    absolute bottom-0 w-full h-1 left-0 origin-left"
    style="transform: scaleX({progressScale}); transition-duration: {durationTimeout};"/>
  {/if}
</div>
