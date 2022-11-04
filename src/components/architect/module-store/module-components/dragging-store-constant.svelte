<script lang="ts">
import type { ArchitectContext } from "src/entities/auxiliary-entities/architect-context";
import { getContext } from "svelte";
import { spring } from "svelte/motion";

const context = getContext<ArchitectContext>("architectContext");

export let constantName = "";

let { mousePos } = context;

const coords = spring({ x: $mousePos.x, y: $mousePos.y }, { stiffness: 0.12, damping: 0.42 });

mousePos.subscribe((value) => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  coords.set({ x: value.x, y: value.y });
});
</script>


<div class="fixed pointer-events-none z-10 -translate-x-[50%] -translate-y-[50%]" style="left: {$coords.x}px; top: {$coords.y}px;">
  <div class="h-8 bg-norbalt-200 py-1 px-2 rounded shadow"> {constantName} </div>
</div>
