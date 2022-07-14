<script lang="ts">
  import { onMount } from "svelte";
  import type { Writable } from "svelte/store";
  import type { DeleteModuleEvent } from "../../common/types/events";
  import type { ModuleCard } from "../../common/types/module-card";
  
  export let hidden = false;
  export let bopModules : Writable<ModuleCard[]>
  export let ref : HTMLDivElement;

  onMount(() => {
    ref.addEventListener("deleteModule", (e : CustomEvent<DeleteModuleEvent>) => {
      const mouse = e.detail.mouseEvent
      const trashRect = ref.getBoundingClientRect()
      if(isColliding(mouse.x, mouse.y, trashRect)) deleteCard(e.detail.key);
    })
  })

  function deleteCard (key : number) {
    bopModules.update(modules => {
      // Remove Dependants
      modules.forEach(module => {
        for(let i = module.dependencies.length-1; i >= 0; i--) {
          if(module.dependencies[i].origin === key)
          {module.dependencies.splice(i, 1);}
        }
      });

      const index = $bopModules.findIndex(module => module.key === key);
      modules.splice(index, 1);

      return modules;
    });
  }

  function isColliding(x : number, y : number, targetRect : DOMRect) : boolean {
    return (x > targetRect.x && x < targetRect.x + targetRect.width) &&
      (y > targetRect.y && y < targetRect.y + targetRect.height);
  }
</script>

<div class="trash" bind:this={ref} style="right: {hidden ? "10px" : "18.5%"};">
  TRASH
</div>

<style lang="scss">
  .trash {
    transition: right 250ms ease-in-out;
    user-select: none;
    position: absolute;
    bottom: 10px;
    right: 20%;
    background-color: crimson;
    border-radius: 7px;
    padding: 10px 30px;
    z-index: 0;
  }
</style>