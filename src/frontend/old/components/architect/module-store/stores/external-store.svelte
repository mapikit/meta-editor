<script async lang="ts">
  import type { FunctionDefinition } from "@meta-system/meta-function-helper";
  import List from "../../../list/list.svelte";
  import StoreSection from "../store-section.svelte";
  import beautify from "json-beautify";
  import type { Writable } from "svelte/store";
  import type { ModuleCard } from "../../../../common/types/module-card";
import PackageSearcher from "../../../modal/package-searcher.svelte";
import { NPMApi } from "../../../modal/npm-api";
import DoneButton from "../../../common/done-button.svelte";
import { storageManager } from "../../../../stores/storage-manager";
import type { SpecificPackageInfo } from "../../../modal/package-list-info";
import Spinner from "../../../../icons/spinner.svelte";
  
  export let search  = "";
  export let modules : Promise<Record<string, FunctionDefinition[]>>;
  export let refreshModules : () => void;
  export let bopModules : Writable<ModuleCard[]>;
  export let storeLocked = false;

  let refreshSearch : () => void;
  let validatedPackage : SpecificPackageInfo = undefined;
  let addingToDb = false;

  let addingType : "function" | "package" | undefined = undefined;

  function togglePackageAdder (type : "function" | "package" | undefined) : void {
    addingType = addingType === type ? undefined : type;
    // storeLocked = addingModule;
  }

  function validatePackage () : void  {
    addingToDb = true;
    void storageManager.manager.validatePackage(
      validatedPackage.name,
      addingType,
      validatedPackage.version,
    ).then(() => {
      addingType = undefined;
      refreshModules();
      addingToDb = false;
    });
  }
</script>

<div class="relative h-full">
  {#await modules}
    <div> Looking for available modules... </div>
  {:then result}
    <div class="inline-flex w-full">
      <button on:click={() => togglePackageAdder("package")} class="m-1 w-1/2 rounded bg-norbalt-100 hover:bg-norbalt-300">{addingType === "package" ? "Cancel" : "Add Package"}</button>
      <button on:click={() => togglePackageAdder("function")} class="m-1 w-1/2 rounded bg-norbalt-100 hover:bg-norbalt-300">{addingType === "function" ? "Cancel" : "Add Function"}</button>
    </div>
    <List contents={Object.keys(result)} let:item>
      <StoreSection
        sectionModulesType="external"
        summary={item}
        modulesInSection={result[item]}
        bind:search
        bind:storeLocked
        bind:bopModules
      />
    </List>
    {#if addingType !== undefined}
        <div class="bg-norbalt-300 w-full mt-2 px-2 pb-2 rounded border border-offWhite absolute bottom-0">
          {#if addingToDb}
            <div class="align-middle text-center"><Spinner height=40 /></div>
          {:else}
            <div class="text-xl w-full p-1">Adding {addingType}</div>
            <PackageSearcher
              packageType={addingType}
              queryFunction={NPMApi.queryModules}
              validateFunction={NPMApi.validateMetaFile}
              getVersionsFunction={(info) => NPMApi.getVersions(info.header.name)}
              bind:validatedPackage
              bind:refreshSearch
              selectorDir="top"
            />
            <DoneButton enabled={validatedPackage !== undefined} onClick={validatePackage}/>
          {/if}
        </div>
    {/if}
  {:catch err}
    <div class="inside">Error {beautify(err, null, 1)}</div>
  {/await}
  
</div>
