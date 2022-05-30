<script lang="ts">
import Route from "../lib/router/route.svelte";
import HomeContent from "./home/home-content.svelte";
import Mapibox from "./mapibox/mapibox.svelte";
import PageBaseLayout from "./layouts/page-base-layout.svelte";
import System from "./mapibox/system/system.svelte";
</script>

<div style="width: 100%; height: 100%;">
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
  </PageBaseLayout>
</div>