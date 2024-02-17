<script lang="ts">
	import { writable } from "svelte/store";
	import { scale, slide } from "svelte/transition";
	import type { MetaFileTypes } from "../../common/types/validated-packages";
	import Spinner from "../../icons/spinner.svelte";
	import Selector from "../common/selector.svelte";
	import TextField from "../fields/text-field.svelte";
	import type { PackageListInfo, SpecificPackageInfo } from "./package-list-info";
	import PackageList from "./package-list.svelte";

export let packageType : MetaFileTypes;
export let queryFunction : (name : string) => Promise<Array<PackageListInfo>>;
export let validateFunction : (name : string, version : string, type : MetaFileTypes) => Promise<SpecificPackageInfo>;
export let getVersionsFunction : (selectedInfo : PackageListInfo) => Promise<Array<string>>;
export let selectorDir = undefined;

export let validatedPackage : SpecificPackageInfo = undefined;

let packageNameSearch = writable("");
let packageVersions : Array<string> = [];
let selectedPackage : PackageListInfo = undefined;
let nameSearchTimeout = undefined;
let loading = false;
let findingVersions = false;
let validatingVersion = false;
let selectedVersion = "---";

let foundPackages : Array<PackageListInfo> = [];
let versionsError = undefined;

export const refreshSearch = (..._watched : unknown[]) : void => {
  search($packageNameSearch);
};

$: refreshSearch(packageType);

function search (name : string) : void {
  if(nameSearchTimeout !== undefined) clearTimeout(nameSearchTimeout);
  loading = true;
  packageVersions = [];
  selectedPackage = undefined;
  versionsError = undefined;
  validatedPackage = undefined;

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  nameSearchTimeout = setTimeout(async () => {
    foundPackages = await queryFunction(name);
    loading = false;
  }, 2000);
}

packageNameSearch.subscribe(name => search(name));

async function handlePackageSelected (event : CustomEvent<PackageListInfo>) : Promise<void> {
  packageNameSearch.set(event.detail.header.name);
  selectedPackage = event.detail;
  clearTimeout(nameSearchTimeout);
  foundPackages = [];
  loading = false;
  findingVersions = true;
  packageVersions = await getVersionsFunction(event.detail);
  findingVersions = false;
}

function handleVersionSelected ({ label }) : void {
  selectedVersion = label;
  validatedPackage = undefined;
  validatingVersion = true;
  versionsError = undefined;
  validateFunction($packageNameSearch, label, packageType)
    .then((res) => { validatedPackage = res; })//selectedPackage.fullPackages.find(pack => pack.version === label);})
    .catch(error => { versionsError = error; })
    .finally(() => { validatingVersion = false; });
}

</script>


<div class="w-full">
  <div class="flex flex-row">
    <div class="flex-1" in:slide|global>
      <TextField bind:field={packageNameSearch} placeholder="Protocol Name"/>
    </div>
    {#if findingVersions}
      <Spinner height=20 />
    {:else if packageVersions.length > 0}
      <div class="ml-2 mt-1.5 w-20" in:scale|global>
        <Selector bind:field={selectedVersion} options={packageVersions.map(version => ({ label: version, value: version }))} expandDirection={selectorDir} onChange={handleVersionSelected}/>
      </div>
    {/if}
  </div>
  {#if validatingVersion}
    <div class="align-middle text-center"><Spinner height=30 /></div>
  {:else if validatedPackage !== undefined}
    <div class="mt-2 mb-2 p-2 rounded bg-norbalt-400 border border-brightGreen text-brightGreen">
      Package is valid!
    </div>
  {:else if versionsError !== undefined}
    <div class="mt-2 mb-2 p-2 rounded bg-norbalt-400 border border-roseRed text-roseRed">{versionsError}</div>
  {/if}
</div>

<PackageList packages={foundPackages} bind:loading on:selected={handlePackageSelected}/>