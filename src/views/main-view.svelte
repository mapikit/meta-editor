<script lang="ts">
import Route from "../lib/router/route.svelte";
import HomeContent from "./home/home-content.svelte";
import Mapibox from "./mapibox/mapibox.svelte";
import PageBaseLayout from "./layouts/page-base-layout.svelte";
import System from "./mapibox/system/system.svelte";
	import Login from "./login/login.svelte";
	import { storageManager } from "../stores/storage-manager";
	import { navigation } from "../lib/navigation";

const promise = async () => {
  await storageManager.loadAllInfo();
}


function goToLogin () {
  navigation.navigateTo("/login");
}
</script>

{#await promise().catch(() => goToLogin())}
	<p class="carregando">Aguarde, carregando informações...</p>
{:then}
<div style="width: 100%; height: 100%;" class="select-none">
  <PageBaseLayout>
    <Route path="/">
      <HomeContent />
    </Route>
    <Route path="/home">
      <HomeContent />
    </Route>
    <Route path="/mapibox">
      <Mapibox />
    </Route>
    <Route path="/mapibox/system/:systemId" deepMatch={true}>
      <System />
    </Route>
    <Route path="/login">
      <Login />
    </Route>
  </PageBaseLayout>
</div>
{/await}

<style lang="scss">
  .carregando {
    margin-top: 100px;
    text-align: center;
    font-size: 42pt;
  }
</style>