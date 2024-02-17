<script lang="ts">
  import { capitalize } from "../../common/helpers/capitalize";
  import { Writable, writable } from "svelte/store";
  import Modal from "./modal.svelte";
  import ChangeIcon from "../../icons/change-icon.svelte";
  import { storageManager } from "../../stores/storage-manager";
  import PackageSearcher from "./package-searcher.svelte";
  import { NPMApi } from "./npm-api";
  import type { PackageListInfo, SpecificPackageInfo } from "./package-list-info";
  import DoneButton from "../common/done-button.svelte";
import Spinner from "../../icons/spinner.svelte";
  
  export let closeModal;
  export let openModal;
  export let onSelect : (selected : SpecificPackageInfo) => void = () => undefined;


  let validatedPackage : SpecificPackageInfo;

  let selectedTab : Writable<string> = writable("search");

  const tabs = ["search", "add"];

  $: selectedClass = (tab) : string => {
    return (tab === selectedTab && "border-offWhite text-white bg-norbalt-400 font-bold")
      || "bg-norbalt-350 text-offWhite border-norbalt-100";
  };

  let confirmStyle = "";
  $: confirmStyle = validatedPackage !== undefined ?
    "bg-norbalt-400 hover:stroke-brightGreen hover:text-white cursor-pointer" : "bg-norbalt-100";


  $: unselectedTab = tabs.filter((tab) => tab !== $selectedTab)[0];

  // eslint-disable-next-line max-lines-per-function
  async function getProtocols (name : string) : Promise<Array<PackageListInfo>> {
    let protocols : Array<PackageListInfo<"protocol">>  = [];
    const result = await storageManager.manager.getProtocols(name);

    // eslint-disable-next-line max-lines-per-function
    result.forEach(protocol => {
      const found = protocols.findIndex(info => info.header.name === protocol.protocolName);
      if(found !== -1) {
        protocols[found].header.versions.push(protocol.version);
        protocols[found].fullPackages.push({
          description: protocol.description,
          version: protocol.version,
          author: protocol.author,
          name: protocol.protocolName,
          type: "protocol",
          configuration: protocol,
        });
      } else { protocols.push({
        header:{
          author: protocol.author,
          description: protocol.description,
          name: protocol.protocolName,
          versions: [protocol.version],
        }, fullPackages: [{
          description: protocol.description,
          version: protocol.version,
          author: protocol.author,
          name: protocol.protocolName,
          type: "protocol",
          configuration: protocol,
        }],
      });
      }

    });
    return protocols;
  }
  let refreshSearch : () =>  void;

  const changeTab = () : void => { $selectedTab = unselectedTab; refreshSearch();};
  let validatingPackage = false;
  async function addProtocol () : Promise<void> {
    if(validatedPackage === undefined) closeModal();
    else if($selectedTab === "search") onSelect(validatedPackage);
    else {
      validatingPackage = true;
      await storageManager.manager.validatePackage(
        validatedPackage.name,
        "protocol",
        validatedPackage.version,
      );
      validatingPackage = false;
    }
  }

  async function validateProtocol (name : string, version : string)
    : Promise<SpecificPackageInfo<"protocol">> {
    const configs = await storageManager.manager.getProtocols(name);
    const info = configs.find(config => config.protocolName === name && config.version === version);
    const result : SpecificPackageInfo<"protocol"> = {
      author: info.author,
      name: info.protocolName,
      type: "protocol",
      version: info.version,
      configuration: info,
      description: info.description,
    };
    return result;
  }
</script>

<Modal bind:closeModal bind:openModal>
  <div class="w-96 bg-norbalt-300 shadow rounded-md p-4" on:click="{(e) => e.stopPropagation()}">
    <div class="flex flex-row justify-between items-center text-lg font-semibold">
      <p> Protocol Picker </p>
      <div class="flex-1 ml-6 h-0.5 bg-norbalt-100"/>
      <div class="px-3 text-sm py-1 flex flex-row items-center bg-norbalt-400 text-offWhite ml-3 rounded shadow-sm hover:text-white cursor-pointer stroke-offWhite hover:stroke-white transition-all"
        on:click="{changeTab}" >
        <ChangeIcon style="stroke-inherit mr-2"/>
        {capitalize(unselectedTab)}
      </div>
    </div>
    <div class="w-full mt-3">
      {#if validatingPackage}
        <div class="align-middle text-center"><Spinner height=40 /></div>
      {:else}
        <PackageSearcher
          bind:refreshSearch
          getVersionsFunction={$selectedTab === "add" ? (e) => NPMApi.getVersions(e.header.name) : async (e) => e.header.versions}
          packageType="protocol"
          queryFunction={$selectedTab === "add" ? NPMApi.queryModules : getProtocols}
          validateFunction={$selectedTab === "add" ? NPMApi.validateMetaFile : validateProtocol}
          bind:validatedPackage
        />
      {/if}
    </div>
    <DoneButton enabled={validatedPackage !== undefined} onClick={addProtocol} />
  </div>
</Modal>