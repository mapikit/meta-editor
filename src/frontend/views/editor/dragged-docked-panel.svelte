<script lang="ts">
	import cursor from "../../../entities/stores/cursor-store";
  import { spring } from "svelte/motion";


  export let constantName = "";
  // TODO: fetch de docked view name/type/params to populate the floating element

  let { position } = cursor;

  const coords = spring({ x: $position.x, y: $position.y }, { stiffness: 0.12, damping: 0.42 });

  position.subscribe((value) => {
    coords.set({ x: value.x, y: value.y })
      .catch(() => void 0);
  });
  </script>


  <div class="fixed pointer-events-none z-20
    -translate-x-[50%] -translate-y-[50%]" style="left: {$coords.x}px; top: {$coords.y}px;">
    <div class="h-8 bg-norbalt-200 py-1 px-2 rounded shadow"> {constantName} </div>
  </div>

