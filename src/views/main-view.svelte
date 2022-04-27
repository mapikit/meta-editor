<script>
import Switch from "../lib/router/switch.svelte";
import Route from "../lib/router/route.svelte";
import HomeContent from "./home/home-content.svelte";
import Mapibox from "./mapibox/mapibox.svelte";
import PageBaseLayout from "./layouts/page-base-layout.svelte";
import PropertiesList from "./mapibox/system/properties-list.svelte";

</script>

<div style="width: 100%; height: 100%;">
  <PageBaseLayout>
    <Switch>
      <Route path="/">
        <HomeContent />
      </Route>
      <Route path="/home">
        <HomeContent />
      </Route>
      <Route path="/mapibox">
        <Mapibox />
      </Route>
      <Route path="/mapibox/system/:selectedProp/">
        <PropertiesList />
      </Route>
    </Switch>
  </PageBaseLayout>
</div>