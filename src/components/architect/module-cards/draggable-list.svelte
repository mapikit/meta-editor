<script lang="ts">
  import {flip} from 'svelte/animate';
  import type { Writable } from 'svelte/store';
  import type { ModuleCard, UICompliantDependency } from '../../../common/types/module-card';
  
  export let parentModule : ModuleCard;
  export let bopModules : Writable<ModuleCard[]>;

  let originIndex : number = -1;
  let hovering : number = -1;
  let positiveOffset : boolean = true;
  $: positiveOffset = hovering > originIndex;



  let list : UICompliantDependency[];
  $: list = parentModule.dependencies.filter(dependency => dependency.targetPath === undefined);
  let contents : Array<string> = [];
  $: contents = list.map(dependency => {
    const moduleName = $bopModules.find(module => module.key === dependency.origin).moduleName;
    return `${moduleName} @${dependency.origin}`;
  });

  const moveList = (targetIndex : number) => {
    hovering = -1;
    if (originIndex === targetIndex || originIndex < 0 || originIndex > list.length) return;

    bopModules.update(modules => {
      const offset = targetIndex > originIndex ? 0 : -1;
      const head = list.slice(0, targetIndex + 1 + offset)
      const tail = list.slice(targetIndex + 1 + offset);

      list = [ ...head, list[originIndex], ...tail ]
      list.splice(originIndex - offset, 1);

      parentModule.dependencies = parentModule.dependencies.filter(dependency => dependency.targetPath !== undefined);
      parentModule.dependencies.unshift(...list);
      const parentIndex = modules.findIndex(module => module.key === parentModule.key);
      modules[parentIndex] = parentModule;
      return modules;
    })

    originIndex = -1;
  };

  const dragStarted = (event : DragEventInit, index : number) => {
    event.dataTransfer.effectAllowed = "move";
    originIndex = index;
  };


  const draggingOver = (event : DragEvent, index : number) => {

    event.preventDefault();
    hovering = index;
    event.dataTransfer.dropEffect = "move";
  };

  const dropped = (event : DragEvent, index : number) => {
    event.preventDefault();
    event.stopPropagation();
    moveList(index);
  };

</script>

{#each contents as content, index (content)}

  <li class="contents" 
    animate:flip
    draggable="true"
    style="{hovering === index && index !== originIndex ? (positiveOffset ? "border-bottom:":"border-top:") + " 5px solid #bbbbbb;": "" }"
    on:dragstart={(event) => dragStarted(event, index)} 
    on:dragover={(event) => draggingOver(event, index)} 
    on:drop={(event) => dropped(event, index)}
    on:dragend={() => hovering = -1}
    on:mousedown|stopPropagation
    on:click|stopPropagation
  >
    <span>{content}</span>
  </li>
{/each}


<style>
  .contents {
    color: black;
    padding: 0 8px 0 8px;
    list-style-type: decimal;
    list-style-position: inside;
    cursor: grab;
  }
</style>