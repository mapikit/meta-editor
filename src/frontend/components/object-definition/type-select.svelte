<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import ChevronIcon from "../../icons/chevron-icon.svelte";
  import ArrowIcon from "../../icons/arrow-icon.svelte";
  import { EditorLevel, EditorLevels } from "./obj-def-editor-types-and-helpers";
  import { typeColors } from "src/frontend/lib/type-colors";
  import Tooltip from "../tooltip.svelte";

  let collapsed = true;
  let subTypeCollapsed = true;
  export let currentType = "string";
  export let currentSubtype = undefined;
  export let level : EditorLevel = new EditorLevel(EditorLevels.createAndSignDefinition);
  export let omittedTypes : Array<keyof typeof typeColors> = [];
  export let size : "default" | "small" = "default";

  const availableOptions = Object.keys(typeColors)
    .filter((typeName) => !omittedTypes.includes(typeName as keyof typeof typeColors));
  const availableSubTypeOptions = availableOptions.filter((value) => {
    return value !== "array" && value !== "any" && value !== "enum";
  });
  const dispatch = createEventDispatcher();

  // eslint-disable-next-line max-lines-per-function
  const changeType = (type : string) : void => {
    if (type === "array") {
      dispatch("typeChange", type);
      currentType = type;
      subTypeCollapsed = false;

      return;
    }

    currentType = type;
    dispatch("typeChange", type);

    if (type === "object" || type === "enum") {
      changeSubType([]);
      return;
    }

    currentSubtype = undefined;
    collapsed = true;
  };

  // eslint-disable-next-line max-lines-per-function
  const changeSubType = (subtype : unknown) : void => {
    if (subtype === "object") {
      dispatch ("subTypeChange", {
        subtype: [],
        keyName: "Objects of Array",
        type: "object",
        value: {},
        required: true,
      });
      currentSubtype = subtype;
      collapsed = true;
      subTypeCollapsed = true;
      return;
    }

    dispatch("subTypeChange", subtype);
    currentSubtype = subtype;
    collapsed = true;
    subTypeCollapsed = true;
  };

  $: collapsedChevronStyle = collapsed ? "" : "rotate-180";

  const toggleCollapse = () : void => {
    if (level.canAddProperty()) {
      collapsed = !collapsed; subTypeCollapsed = true;
    }
  };

  $: cursorChangeType = level.canAddProperty() ? "cursor-pointer" : "";

  // Size changes
  $: sizeWidth = size === "small" ? "w-8" : "w-11";
  $: sizeHeight = size === "small" ? "h-5" : "h-6";
  $: sizeBall = size === "small" ? "h-2 w-2" : "h-3 w-3";
  $: marginSize = size === "small" ? "" : "ml-2";
  $: dropdownMarginSize = size === "small" ? "top-[calc(100%_+_4px)]" : "top-[calc(100%_+_8px)]";
  $: dropdownWidthSize = size === "small" ? "w-26" : "w-32";
  // eslint-disable-next-line max-len
  $: dropdownItemSize = size === "small" ? "gap-1 px-1.5 py-0.5 first:pt-0.5 last:pb-0.5" : "gap-2 px-3 py-0.5 first:pt-1.5 last:pb-1.5";
  $: dropdownArrowSize = size === "small" ? "w-2 h-2" : "w-2.5 h-2.5";
  let typeTooltipVisible = false;
</script>

<div class="{sizeWidth} {marginSize} rounded bg-norbalt-350 {sizeHeight} border border-norbalt-100
stroke-offWhite hover:stroke-white relative hover:border-offWhite transition-all"
on:blur="{() => { collapsed = true; subTypeCollapsed = true; }}">
  <div class="flex flex-row items-center justify-center h-full {sizeWidth} {cursorChangeType}" 
    on:click="{toggleCollapse}"
    on:mouseenter={() => { typeTooltipVisible = true; }}
    on:mouseleave={() => { typeTooltipVisible = false; }}>
    <Tooltip bind:visible={typeTooltipVisible} tooltipContent={"Type: " + currentType }/>
    <div class="transition-all rounded-full {sizeBall}" style="background-color: {typeColors[currentType]};"/>
    {#if currentSubtype !== undefined && typeof currentSubtype !== "object"}
      <div class="transition-all rounded-full {sizeBall} -ml-1.5" style="background-color: {typeColors[currentSubtype]};"/>
    {:else if typeof currentSubtype === "object" && currentType === "array"}
      <div class="transition-all rounded-full {sizeBall} -ml-1.5" style="background-color: {typeColors["object"]};"/>
    {/if}
    {#if level.canAddProperty()}
      <div class="h-full w-3 flex items-center justify-center ml-1">
        <ChevronIcon style="stroke-inherit w-2 transition-all {collapsedChevronStyle}"/>
      </div>
    {/if}
  </div>
  {#if !collapsed && subTypeCollapsed}
    <div class="z-10 absolute {dropdownMarginSize}" transition:fade|global="{{ duration: 90 }}">
      <div class="{dropdownWidthSize} rounded bg-norbalt-200 shadow-contrast">
        {#each availableOptions as option }
          <div class="transition-all duration-75 cursor-pointer grid flex-row grid-cols-[12px_calc(100%_-_16px)] items-center {dropdownItemSize} first:rounded-t last:rounded-b hover:bg-norbalt-100 stroke-offWhite hover:stroke-white" on:click="{() => {changeType(option);}}">
            <div class="transition-all rounded-full {sizeBall} mt-0.5 " style="background-color: {typeColors[option]};"/>
            {#if option !== "array"}
              <p> {option} </p>
            {:else}
              <p class="flex flex-row justify-between items-center"> {option}
                <ArrowIcon style="{dropdownArrowSize} transition-all mt-1"/>
              </p>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}
  {#if !subTypeCollapsed}
    <div class="z-10 absolute {dropdownMarginSize}" transition:fly|global="{{ duration: 120, delay: 90, x: 20 }}">
      <div class="{dropdownWidthSize} rounded bg-norbalt-200 shadow">
        {#each availableSubTypeOptions as option }
          <div class="transition-all duration-75 cursor-pointer grid flex-row
          grid-cols-[12px_calc(100%_-_16px)] items-center {dropdownItemSize}
          first:rounded-t last:rounded-b hover:bg-norbalt-100 stroke-offWhite hover:stroke-white"
          on:click="{() => {changeSubType(option);}}">
            <div class="transition-all rounded-full {sizeBall} mt-0.5 " style="background-color: {typeColors[option]};"/>
            <p> {option} </p>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
