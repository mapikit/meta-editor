<script lang="ts">
	import CheckIcon from "../../icons/check-icon.svelte";


export let text = "Done";
export let onClick : (event : MouseEvent) => void = () => undefined;
export let enabled = true;

let style = "bg-norbalt-400 hover:stroke-brightGreen hover:text-white cursor-pointer";
$: style = enabled ? "bg-norbalt-400 hover:stroke-brightGreen hover:text-white cursor-pointer" : "bg-norbalt-100";


</script>

<div class="flex flex-row justify-between items-center float-right px-3 text-sm py-1 text-offWhite ml-3 stroke-offWhite rounded shadow-sm transition-all mt-3 font-bold {style}"
  on:click={onClick}>
  {text}
  <CheckIcon style="stroke-inherit ml-2"/>
</div>