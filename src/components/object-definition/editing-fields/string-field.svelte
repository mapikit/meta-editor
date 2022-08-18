<script lang="ts">
  export let propValue = "";
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  export let updateFunction = () : void => {};
</script>

<div class="flex-1">
  <input class="w-full outline-none transition-all h-6 px-2 rounded bg-norbalt-300 border border-norbalt-100 hover:border-offWhite focus:border-offWhite" bind:value="{propValue}" on:change="{updateFunction}"/>
</div>
