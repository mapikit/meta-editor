<script lang="ts">
  import Tooltip from "../../../../components/tooltip.svelte";

  let clazz = "";
  export let action : () => void;
  export let tooltipText : string;
  let hovered = false;
  export { clazz as class };
</script>


<button class="relative text-offWhite {clazz} w-4 mx-0.5 flex justify-center transition"
on:click={action}
on:mouseenter={() => { hovered = true; }}
on:mouseleave={() => { hovered = false; }}
>
  <slot></slot>
  <Tooltip tooltipContent="{tooltipText}" visible={hovered} position="bottom"/>
</button>
