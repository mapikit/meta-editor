<script lang="ts">
  export let propValue = "";
  export let standalone = false;
  export let updateFunction = () => {};
</script>

<div>
  <input class="outline-none transition-all h-6 px-2 w-full rounded bg-norbalt-300 border border-norbalt-100 hover:border-offWhite focus:border-offWhite" bind:value="{propValue}" on:change="{updateFunction}"/>
</div>
