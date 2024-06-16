<script lang="ts">
  export let propValue = "";
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  export let updateFunction = () : void => {};
  export let size : "default" | "small" = undefined;

  $: heightSize = size === "small" ? "h-5 px-1" : "h6 px-2";
</script>

<div class="flex-1">
  <input class="w-full outline-none transition-all {heightSize} rounded bg-norbalt-300 border border-norbalt-100 hover:border-offWhite focus:border-offWhite" bind:value="{propValue}" on:change="{updateFunction}"/>
</div>
