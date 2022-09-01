<script lang="ts">
  import { capitalize } from "../../common/helpers/capitalize";
  import { writable } from "svelte/store";
  import TextField from "../fields/text-field.svelte";
  import Modal from "./modal.svelte";
  import CheckIcon from "../../icons/check-icon.svelte";
  import ChangeIcon from "../../icons/change-icon.svelte";
  
  let closeModal;
  export let openModal;
  export let onSelect = () : void => {};

  let selectedTab = "search";
  const tabs = ["search", "add"];

  $: selectedClass = (tab) : string => {
    return (tab === selectedTab && "border-offWhite text-white bg-norbalt-400 font-bold")
      || "bg-norbalt-350 text-offWhite border-norbalt-100";
  };

  $: unselectedTab = tabs.filter((tab) => tab !== selectedTab)[0];

  let protocolNameSearch = writable("");
  let protocolVersionSearch = writable("1.0.0");

  const changeTab = () : void => { selectedTab = unselectedTab; };
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
    {#if selectedTab === "search"}
      <div class="w-full mt-3">
        <div class="flex flex-row">
          <div class="flex-1">
            <TextField bind:field={protocolNameSearch} placeholder="Protocol Name"/>
          </div>
          <div class="ml-2 w-20">
            <TextField bind:field={protocolVersionSearch} placeholder="Version"/>
          </div>
        </div>
      </div>
    {:else}
      <div>

      </div>
    {/if}
    <div class="flex flex-row justify-between items-center float-right px-3 text-sm py-1 bg-norbalt-400 text-offWhite ml-3 stroke-offWhite rounded shadow-sm hover:stroke-brightGreen hover:text-white cursor-pointer transition-all mt-3 font-bold" on:click="{closeModal}">
      Done
      <CheckIcon style="stroke-inherit ml-2"/>
    </div>
  </div>
</Modal>