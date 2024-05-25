<script lang="ts">
  import { X } from "phosphor-svelte";
  import { NotificationData, notificationManager } from "./notification-center";
  import { fly } from "svelte/transition";

  export let notification : NotificationData;

  let hovered = false;
  let notificationOutlineMap : Record<NotificationData["type"], string> = {
    "debug": "outline-royalBlue",
    "warn": "outline-ochreYellow",
    "error": "outline-roseRed",
    "info": "outline-norbalt-200",
  };
</script>

<!-- Just an effect, no aria role needed -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="relative rounded outline outline-2 {notificationOutlineMap[notification.type]} bg-norbalt-300 shadow
py-3 px-4 mt-3 max-w-3xl w-fit pointer-events-auto"
  on:mouseenter={() => { hovered = true; }}
  on:mouseleave={() => { hovered = false; }}
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
</div>
