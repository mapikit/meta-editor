<script lang="ts">
	import { slide } from "svelte/transition";
	import CancelIcon from "../../../icons/cancel-icon.svelte";
  import CheckIcon from "../../../icons/check-icon.svelte";

  export let onConfirm : Function = () => {};
  export let onCancel : Function = () => {};


</script>
<span class="flex w-100 ml-3" transition:slide>
  <span class="px-1.5 py-1.5 rounded bg-norbalt-100 stroke-white mr-1 border-transparent border-2 hover:border-brightGreen hover:stroke-brightGreen" id="Confirm" on:click={() => onConfirm()}><CheckIcon style="stroke-inherit"/></span>
  <span class="px-1.5 py-1.5 rounded bg-norbalt-100 stroke-white border-transparent active:bg-white border-2 hover:border-roseRed hover:stroke-roseRed" id="Cancel" on:click={() => onCancel()}><CancelIcon style="stroke-inherit"/></span>
</span>
