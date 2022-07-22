<script lang="ts">
import BopIconSmall from "../../icons/bop-icon-small.svelte";
import SchemaIconSmall from "../../icons/schema-icon-small.svelte";
import ProtocolIconSmall from "../../icons/protocol-icon-small.svelte";
import Tooltip from "../common/tooltip.svelte";

export let name : "Business Operations" | "Schemas" | "Protocols";
export let count;
export let textColor;
export let fillColor;

let hovered = false;

let SelectedIcon;

$: SelectedIcon = name === "Business Operations"
  ? BopIconSmall : name === "Protocols" ? ProtocolIconSmall : SchemaIconSmall;

</script>

<div class="relative flex flex-row justify-center items-center"
  on:mouseenter="{() => { hovered = true; }}"
  on:mouseleave="{() => { hovered = false; }}"
>
  <div>
    <SelectedIcon fill={fillColor}/>
  </div>
  <div class="ml-1 {textColor}"> {count} </div>
  <Tooltip visible={hovered} tooltipContent="{name}" position={"bottom"}/>
</div>