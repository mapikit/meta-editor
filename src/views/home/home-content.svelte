<script lang="ts">
import globalUser from "../../stores/global-user-store";

import GuideText from "../../components/common/guide-text.svelte";
import { navigation } from "../../lib/navigation";

const favorites = [
  { type: "BOp", name: "Business procedure 48", description: "This" },
  { type: "BOp", name: "Business procedure 49", description: "This" },
  { type: "BOp", name: "Business procedure 50", description: "This" },
  { type: "BOp", name: "Business procedure 51", description: "This" },
  { type: "BOp", name: "Business procedure 52", description: "This" },
];

let userEmail = globalUser.email;
</script>

<div class="background">
  <GuideText />
  <div id="username">
    <img src="/logo.svg" alt="mapikit crown logo"/>
    <p> <span>  Welcome, </span> {$userEmail} </p>
  </div>

  <div id="favorite-bar">
    {#if favorites.length === 0}
      <div class="empty-favorites"> When you star something, it will apear here. </div>
    {:else}
      {#each favorites as favoriteItem}
        <div class="favorite-item" on:click="{() => { navigation.navigateTo("/mapibox"); }}">
          <div class="title"> {favoriteItem.name} </div>
          <div class="description"> {favoriteItem.description} </div>
        </div>
      {/each}
    {/if}
  </div>
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

  #favorite-bar {
    margin-top: 82px;
    font-family: "Dosis";
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    max-width: 1300px;

    .empty-favorites {
      font-size: 24px;
      color: #45455e;
    }

    .favorite-item {
      background-color: #0e0e16;
      padding: 8px;
      border-radius: 12px;
      border: 3px solid #24243b;
      width: 360px;
      margin-top: 18px;
      transition: background 250ms;

      .title {
        font-size: 18px; 
        text-align: center;
        font-weight: bolder;
      }

      .description {
        color: #45455e;
        padding: 12px;
      }

      &:hover {
        background-color: #292935;
      }
    }
  }
</style>
