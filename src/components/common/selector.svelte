<script lang="ts">
  export let options = [ "op1", "op2", "op3" ];
  export let field;

  let focused = false;
  let hovered = false;

  let focusClass = "";
  let focusChevronClass = "";
  let hoveredClass = "";

  $: focusClass = focused ? "border-white" : "";
  $: hoveredClass = hovered ? "border-offWhite" : "";
  $: focusChevronClass = focused ? "rotate-90 !important" : "-rotate-90";
</script>

<div class="bg-norbalt-350 relative rounded w-full py-1 flex flex-row flex-nowrap border border-norbalt-100 transition-all {hoveredClass} {focusClass}"
  on:click="{(e) => { focused = !focused; e.stopPropagation(); }}"
  on:mouseenter="{() => { hovered = true; }}"
  on:mouseleave="{() => { hovered = false; }}"
>
  <div class="absolute left-3 {focusChevronClass}"> > </div>
  <p class="text-center w-full"> {field} </p>
  {#if focused}
    <div class='bg-norbalt-200 shadow p-2 absolute mt-2 top-full w-full rounded'>
      {#each options as option }
        <div on:click="{() => {field = option; }}"> {option} </div>
      {/each}
    </div>
  {/if}
</div>
