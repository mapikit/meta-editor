<script lang="ts">
  import { DivScreenOperations } from "../../common/helpers/div-screen-operations";
  import { onMount } from "svelte";

  let listElement : HTMLElement;

  export let options : Array<{ label : string; value : unknown }> = [];
  export let field;
  export let expandDirection : "top" | "bottom" = "bottom";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  export let onChange = (_selected : unknown) : void => {};

  const minimumDownwardsAvailableHeight = 80; //px
  let afterMountDirection = expandDirection;
  let heightStyle = "";

  onMount(() => {
    const rect = listElement.getBoundingClientRect();
    if (!DivScreenOperations.isElementInViewport(listElement)
      && rect.bottom > DivScreenOperations.getViewportHeight()
    ) {
      // Currently only treating case when growing too much downwards
      const availableHeight = DivScreenOperations.getViewportHeight() - rect.top;
      if (availableHeight < minimumDownwardsAvailableHeight) {
        afterMountDirection = "top";
        return;
      }

      heightStyle = rect.height - (rect.bottom - DivScreenOperations.getViewportHeight()) - 16 + "px";
    }

    // TODO: Change directions when there is not enough space downwards by "minimumDownardsAvailableHeight"
  });
</script>

<div class='bg-norbalt-200 shadow border border-norbalt-100 absolute my-2 {expandDirection === "bottom" ? "top-full" : "bottom-full"} w-full rounded text-sm left-0 overflow-scroll max-h-[40vh] z-[1]'
  bind:this={listElement}
  style="height: {heightStyle}"
>
  {#each options as option }
    <div class="px-2 py-1 first:pt-2 last:pb-2 hover:bg-norbalt-100 transition-all duration-100"
      on:click="{() => {field = option.value; onChange(option); }}"> {option.label} </div>
  {/each}
</div>