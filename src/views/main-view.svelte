<script>
import Switch from "../lib/router/switch.svelte";
import Route from "../lib/router/route.svelte";
import HomeContent from "./home/home-content.svelte";
import Mapibox from "./mapibox/mapibox.svelte";
import PageBaseLayout from "./layouts/page-base-layout.svelte";
import System from "./mapibox/system/system.svelte";

</script>

<div style="width: 100%; height: 100%;">
  <PageBaseLayout>
    <Switch basePath="/">
      <Route path="/">
        <HomeContent />
      </Route>
      <Route path="/home">
        <HomeContent />
      </Route>
      <Route path="/mapibox">
        <Mapibox />
      </Route>
      <Route path="/mapibox/system/" deepMatch={true} >
        <System />
      </Route>
    </Switch>
  </PageBaseLayout>
</div>