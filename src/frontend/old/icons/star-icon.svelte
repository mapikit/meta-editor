<script lang="ts">
	import { createEventDispatcher } from "svelte";


  export let style= "stroke-white fill-transparent";
  const dispatch = createEventDispatcher();
</script>

<svg class={style} width="19.532" height="18.685" version="1.1" viewBox="0 0 5.1677 4.9438" xmlns="http://www.w3.org/2000/svg" on:click={() => dispatch("click")}>
 <path d="m2.5839 0.26459c0.18531 0 0.77383 1.0502 0.92374 1.1591 0.14991 0.1089 1.3309 0.34387 1.3882 0.52004 0.057262 0.17617-0.76002 1.0602-0.81727 1.2364-0.057262 0.17617 0.084124 1.3716-0.065794 1.4805-0.14992 0.10888-1.2436-0.39494-1.4288-0.39494-0.18531 0-1.2789 0.5038-1.4288 0.39494-0.14992-0.10888-0.0085355-1.3043-0.065797-1.4805-0.057265-0.17617-0.87456-1.0602-0.81727-1.2364 0.057265-0.17617 1.2383-0.41114 1.3882-0.52004s0.73842-1.1591 0.92374-1.1591z" stroke-linejoin="round" stroke-width=".52918"/>
</svg>
