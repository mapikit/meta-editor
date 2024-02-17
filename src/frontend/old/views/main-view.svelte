<script lang="ts">
  import Route from "../lib/router/route.svelte";
  import HomeContent from "./home/home-content.svelte";
  import editor from "./editor/editor.svelte";
  import PageBaseLayout from "./layouts/page-base-layout.svelte";
  import System from "./editor/system/system.svelte";
  import Login from "./login/login.svelte";
  import { storageManager } from "../stores/storage-manager";
  import { navigation } from "../lib/navigation";

  const promise = async () : Promise<void>  => {
    await storageManager.loadAllInfo();
  };

  function goToLogin () : void {
    navigation.navigateTo("/login");
  }
</script>

{#await promise().catch(() => goToLogin())}
	<p class="carregando">Aguarde, carregando informações...</p>
{:then}
<div style="width: 100%; height: 100%;" class="select-none">
  <Route path="/login">
    <Login />
  </Route>
  <!-- <Route path="/register">
    <Register />
  </Route> -->

  <Route path="/" deepMatch={true}>
  <PageBaseLayout>
    <Route path="/">
      <HomeContent />
    </Route>
    <Route path="/home">
      <HomeContent />
    </Route>
    <Route path="/editor">
      <editor />
    </Route>
    <Route path="/editor/system/:systemId" deepMatch={true}>
      <System />
    </Route>
  </PageBaseLayout>
  </Route>
</div>
{/await}

<style lang="scss">
  .carregando {
    margin-top: 100px;
    text-align: center;
    font-size: 42pt;
  }
</style>