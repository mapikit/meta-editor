<script lang="ts">
  export let text : string;
  export let clickFunction : () => void;
  export let disabled : boolean = false;
</script>

<button on:click={clickFunction} disabled={disabled}
  class="bg-norbalt-300 rounded font-bold px-2 text-base text-w text-offWhite ml-6
  hover:bg-norbalt-200 select-none cursor-pointer duration-150 h-7 hover:text-white transition-all"
>
  {text}
</button>

