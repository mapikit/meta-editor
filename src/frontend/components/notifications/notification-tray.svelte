<script>
  import { BellSimple } from "phosphor-svelte";
  import { notificationManager } from "./notification-center";
  import { slide } from "svelte/transition";
  import TextButton from "../text-button.svelte";
  import NotificationCard from "./notification-card.svelte";

  let open = false;
  let { hasPending, pendingNotifications, dismissedNotifications, dismissAll, clearAll } = notificationManager;
</script>

<button class="relative w-8 h-8 flex justify-center items-center bg-transparent hover:bg-norbalt-300
transition duration-150 fill-offWhite hover:fill-white rounded"
on:click={() => { open = !open; }}
>
  <BellSimple class="w-6 h-6 fill-[inherit]"/>
  {#if $hasPending}
    <div class="absolute rounded-full bg-roseRed top-1.5 right-2 w-1.5 h-1.5"/>
  {/if}
</button>

{#if open}
  <aside class="absolute left-12 bottom-0 bg-norbalt-400 w-[26rem] h-full
  bg-sidebar-gradient py-4 px-5 flex flex-col"
  transition:slide={{ axis: "x", duration: 300 }}>
    <div class="flex flex-row items-center justify-start">
      <h1 class="font-bold font-[Livvic] text-2xl"> Notifications </h1>
      <TextButton text="Dismiss" clickFunction={dismissAll}/>
      <TextButton text="Clear All" clickFunction={clearAll} lessMargin/>
      </div>
    <div class="flex-[1] w-[23rem] mt-2 overflow-y-scroll -mr-2 pr-2 pb-0.5">
      <section class="mt-2">
        <h2 class="text-lg font-bold"> Pending </h2>
        <div class="relative flex flex-col-reverse">
          {#each $pendingNotifications as not (not.identifier)}
            <NotificationCard notification={not}/>
          {/each}
        </div>
      </section>
      <section class="mt-2">
        <h2 class="text-lg font-bold whitespace-nowrap"> Past Notifications </h2>
        <div class="relative flex flex-col-reverse">
          {#each $dismissedNotifications as not (not.identifier)}
            <NotificationCard notification={not}/>
          {/each}
        </div>
      </section>
    </div>
  </aside>
{/if}
