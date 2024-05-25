<script>
  import { flip } from "svelte/animate";
  import NotificationCard from "./notification-card.svelte";
  import { notificationManager } from "./notification-center";

  const notifications = notificationManager.currentlyVisibleNotifications;
</script>
<div class="fixed z-10 left-14 bottom-2 flex flex-col-reverse max-w-[calc(100%_-_1em)] pr-2 pointer-events-none w-full">
  {#each $notifications as notification (notification.identifier)}
    <div animate:flip={{ duration: 250 }} class="w-full">
      <NotificationCard notification={notification} />
    </div>
  {/each}
</div>
