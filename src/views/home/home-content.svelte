<script lang="ts">
import globalUser from "../../stores/global-user-store";

import GuideText from "../../components/common/guide-text.svelte";
import FavoriteBar from "./components/favorite-bar.svelte";

let userEmail = globalUser.email;
</script>

<div class="w-full h-full pl-24 flex flex-col items-center justify-center">
  <GuideText />
  <div class="flex flex-row justify-start w-3/4 min-w-fit font-titles text-4xl -mt-12">
    <img class="h-9" src="/logo.svg" alt="mapikit crown logo"/>
    <p class="ml-6"> Welcome, {$userEmail} . </p>
  </div>
  <FavoriteBar />
</div>
