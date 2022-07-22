<script lang="ts">
import DuplicateIcon from "../../icons/duplicate-icon.svelte";
import ClipboardIcon from "../../icons/clipboard-icon.svelte";
import CraterIcon from "../../icons/crater-icon.svelte";
import Tooltip from "../common/tooltip.svelte";
import { formatDistanceToNow } from "date-fns";
import type { Configuration } from "../../entities/configuration";
import { get } from "svelte/store";
import SystemPropAmountDisplay from "../systems-sidebar/system-prop-amount-display.svelte";
import LockIcon from "../../icons/lock-icon.svelte";

let duplicateHovered = false;
let craterHovered = false;
let summary;

export let currentVersion : Configuration;
let locked = false;

$: summary = currentVersion?.getConfigurationSummary();
</script>

<div class="bg-norbalt-200 rounded-md p-4 shadow">
  <div class="flex flex-row justify-between items-center"> <!-- Card Header -->
    <p class="text-lg font-semibold text-white"> Version Overview </p>
    <div class="h-0.5 rounded-sm bg-norbalt-100 mx-3 w-16"/>
    <div class="bg-norbalt-300 px-4 py-1 rounded font-medium text-offWhite fill-offWhite transition-all hover:text-white hover:fill-white cursor-pointer ml-auto flex flex-row items-center">
      Manage
      <ClipboardIcon fill={"fill-inherit ml-2"}/>
    </div>
  </div>
  <div class="flex flex-row items-center mt-3">
    <div class="flex flex-col">
      <div class="flex flex-col justify-center items-center w-10 h-10 bg-norbalt-300 rounded-md hover:bg-norbalt-350 transition-all cursor-pointer relative"
        on:mouseenter="{() => { duplicateHovered = true; }}"
        on:mouseleave="{() => { duplicateHovered = false; }}"
      >
        <DuplicateIcon style="fill-white stroke-white w-5 h-5"/>
        <Tooltip tooltipContent="Clone Version" position="right" visible={duplicateHovered}/>
      </div>
      <div class="flex flex-col justify-center items-center w-10 h-10 bg-norbalt-300 rounded-md hover:bg-norbalt-350 transition-all mt-2 cursor-pointer relative"
        on:mouseenter="{() => { craterHovered = true; }}"
        on:mouseleave="{() => { craterHovered = false; }}"
      >
        <CraterIcon style="w-5 h-5" />
        <Tooltip tooltipContent="Bundle Version and Export" position="right" visible={craterHovered}/>
      </div>
      <div class="flex flex-col justify-center items-center w-10 h-10 border-norbalt-300 border-[3px] rounded-md mt-2" />
    </div>
    <div class="w-0.5 h-32 bg-norbalt-100 ml-3"> <!-- Separator --> </div>
    <div class="flex-1 h-36 pl-5 flex flex-col justify-between pt-2"> <!-- Data Content -->
      <div class="flex flex-col"> <!-- bulk of the content-->
        <div class="flex flex-row justify-between text-offWhite"><p> Last Edit: </p> <p> {formatDistanceToNow(get(currentVersion?.updatedAt) ?? new Date(), { addSuffix: true })} </p></div>
        <div class="flex flex-row justify-between text-offWhite mt-1"><p> Created At: </p> <p> {formatDistanceToNow(get(currentVersion?.updatedAt) ?? new Date(), { addSuffix: true })} </p></div>
      </div>
      <div class="flex flex-row justify-between mt-3 items-end"> <!-- counters and lock button -->
        <div class="rounded bg-norbalt-300 flex w-4/6 flex-row justify-around h-7">
          <SystemPropAmountDisplay name="Schemas" count={summary?.schemasCount ?? 0} textColor={"text-roseRed-light"} fillColor={"fill-roseRed-light"}/>
          <SystemPropAmountDisplay name="Protocols" count={summary?.protocolsCount ?? 0} textColor={"text-crystalBlue-light"} fillColor={"fill-crystalBlue-light"}/>
          <SystemPropAmountDisplay name="Business Operations" count={summary?.bopsCount ?? 0} textColor={"text-ochreYellow-light"} fillColor={"fill-ochreYellow-light"}/>
        </div>
        <div class="rounded bg-norbalt-300 h-9 px-4 flex flex-col justify-center {locked ? "fill-ochreYellow" : "fill-offWhite"} hover:fill-ochreYellow-light transition-all cursor-pointer"
          on:click="{() => { locked = !locked; }}"
        >
          <LockIcon style={"fill-inherit h-6 w-3"} locked={locked}/>
        </div>
      </div>
    </div>
  </div>
</div>