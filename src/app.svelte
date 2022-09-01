<script lang="ts">
import { loadConfigurationsFromStore } from "./stores/configuration-store";
import { availableProjects, loadProjectsFromStore } from "./stores/projects-store";
import { storageManager } from "./stores/storage-manager";
import MainView from "./views/main-view.svelte";

// This file contains general data about the App itself
// and should not contain anything else.

const promiseTest = () : Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 3000);
  });
};

// loadProjectsFromStore();
// loadConfigurationsFromStore();
const promise = async () => {
  await storageManager.loadAllInfo();
  storageManager.subscribeUpdates();
}
</script>


{#await promise()}
	<p class="carregando">Aguarde, carregando informações...</p>
{:then}
  <MainView />
{/await}

<style lang="scss">
  .carregando {
    margin-top: 100px;
    text-align: center;
    font-size: 42pt;
  }
</style>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true">
  <link href="https://fonts.googleapis.com/css2?family=Dosis:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet"> 
  <link href="https://fonts.googleapis.com/css?family=Comfortaa" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Livvic" rel="stylesheet"> 
</svelte:head>
