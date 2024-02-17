<script lang="ts">
  import type { ArchitectContext } from "src/entities/auxiliary-entities/architect-context";
  import { getContext } from "svelte";
  import { spring } from "svelte/motion";
  
  const context = getContext<ArchitectContext>("architectContext");
  
  export let moduleName = "";
  
  let { mousePos } = context;
  
  const coords = spring({ x: $mousePos.x, y: $mousePos.y }, { stiffness: 0.12, damping: 0.42 });
  
  mousePos.subscribe((value) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    coords.set({ x: value.x, y: value.y });
  });
  </script>
  
  <div class="select-none min-w-[120px] bg-norbalt-350 rounded fixed pointer-events-none z-10 -translate-x-[50%] -translate-y-[50%] shadow"
    style="left: {$coords.x}px; top: {$coords.y}px;"
  >
    <div class="h-8 bg-norbalt-350 rounded-t flex flex-row items-center justify-between px-6">
      <div class="flex flex-row h-4 ml-1 absolute left-0">
        {#each [0,1,2] as num}
          <div class="h-full w-[2px] rounded bg-norbalt-100 ml-1.5"/>
        {/each}
      </div>
      <span class="text-offWhite px-12" >{moduleName} </span>
    </div>
  </div>
  