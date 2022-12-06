<script lang="ts">
	import { get } from "svelte/store";
  import { navigation } from "../../../lib/navigation";
	import { availableConfigurations } from "../../../stores/configuration-store";
	import { availableProjects } from "../../../stores/projects-store";

  // const favorites = [
  //   { type: "BOp", name: "Business procedure 48", description: "This" },
  //   { type: "BOp", name: "Business procedure 49", description: "This" },
  //   { type: "BOp", name: "Business procedure 50", description: "This" },
  //   { type: "BOp", name: "Business procedure 51", description: "This" },
  //   { type: "BOp", name: "Business procedure 52", description: "This" },
  // ];

  const favorites = $availableProjects
    .filter(config => config.isStarred)
    .map(config => ({ type: "Project", name: get(config.name), description: get(config.description) }))
  const navigateToFavorite = () : void => { navigation.navigateTo("/mapibox"); };
</script>

<div class="mt-16 w-[870px]">
  <p class="mb-6 text-xl font-bold ml-2"> Quick Access </p>
  <div class="bg-norbalt-350 rounded p-10 grid grid-cols-3 gap-8">
  {#if favorites.length === 0}
    <div class="text-norbalt-100 text-center text-lg"> When you star something, it will apear here. </div>
  {:else}
    {#each favorites as favoriteItem}
      <div class="bg-norbalt-300 w-auto px-6 py-3 rounded-lg border-transparent border-[3px] hover:border-norbalt-100 hover:shadow transition-all shadow-light cursor-pointer" on:click="{navigateToFavorite}">
        <div class="text-lg font-semibold pl-4 pr-2"> {favoriteItem.name} </div>
        <div class="text-offWhite mt-3 font-semibold pl-4 pr-2"> {favoriteItem.description} </div>
      </div>
    {/each}
  {/if}
  </div>
</div>
