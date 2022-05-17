<script lang="ts">
import globalUser from "../../stores/global-user-store";

import GuideText from "../../components/common/guide-text.svelte";
import FavoriteBar from "./components/favorite-bar.svelte";

let userEmail = globalUser.email;
</script>

<div class="background">
  <GuideText />
  <div id="username">
    <img src="/logo.svg" alt="mapikit crown logo"/>
    <p> <span>  Welcome, </span> {$userEmail} </p>
  </div>
  <FavoriteBar />
</div>

<style lang="scss">
  .background {
    padding-left: 90px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
  }

  #username {
    display: flex;
    flex-flow: column nowrap;
    text-align: center;
    align-items: center;

    img {
      width: 76px;
    }
    
    p {
      font-size: 32px;
      font-family: "Livvic";
      margin-top: 26px;
    }
  }
</style>
