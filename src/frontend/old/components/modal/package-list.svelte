<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Spinner from "../../icons/spinner.svelte";
	import Tooltip from "../common/tooltip.svelte";
	import type { PackageListInfo } from "./package-list-info";

export let packages : Array<PackageListInfo> = [];
export let loading = false;

const dispatcher = createEventDispatcher<{selected : PackageListInfo}>();


function getVersionSpan (versions : string[]) : string {
  let max = versions[0], min = versions[0];
  versions.forEach(version => {
    if(max < version) max = version;
    else if (min > version) min = version;
  });
  return min + " - " + max;
}
let hovered = -1;
</script>


{#if loading}
  <div class="rounded border-norbalt-100 border bg-norbalt-400 mt-3 text-center text-royalBlue-lighter">
    <Spinner height=18/> Loading Packages...
  </div>
{:else if packages.length > 0}
  <div class="rounded border-norbalt-100 border overflow-scroll bg-norbalt-400 mt-3  max-h-[30vh]">
    {#each packages as pack, i}
      <div class="hover:bg-offWhite text-white w-full justify-center align-middle text-center rounded relative"      
        on:click={() => dispatcher("selected", pack)} 
        on:mouseenter={() => { hovered = i; } }
        on:mouseleave={() => { hovered = -1; } }
        >
        <Tooltip tooltipContent={pack.header.description ?? "No Description"} visible={hovered === i} position="left"/>
        <table class="w-full relative">
          <thead class="relative">
            <tr>
              <td class="text-lg font-bold" rowspan="2">
                {pack.header?.name} 
              </td>
              <td class="w-2/5 text-royalBlue-light text-sm" > {pack.header?.author ? "by " + pack.header?.author : "Unknown Author"}</td>
            </tr>
            <tr>
              <td class="text-royalBlue-light text-sm">{pack.header?.versions.length > 1 ? getVersionSpan(pack.header?.versions) : pack.header?.versions[0]}</td>
            </tr>
          </thead>
          </table>
      </div>
    {/each}
  </div>
{:else}
  <div class="rounded border-norbalt-100 border bg-norbalt-400 mt-3 text-center text-royalBlue-lighter">
    No Packages Found
  </div>
{/if}