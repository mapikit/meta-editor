<script>

import { navigation } from "../lib/navigation";
import PageBaseLayout from "./layouts/page-base-layout.svelte";

</script>
<PageBaseLayout>
  What you're looking for is not here.
  
  <div on:click="{() => { navigation.goBack(); }}">
    go back
  </div>
</PageBaseLayout>