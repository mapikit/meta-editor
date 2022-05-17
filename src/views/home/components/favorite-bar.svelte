<script lang="ts">
  import { navigation } from "../../../lib/navigation";

  const favorites = [
    { type: "BOp", name: "Business procedure 48", description: "This" },
    { type: "BOp", name: "Business procedure 49", description: "This" },
    { type: "BOp", name: "Business procedure 50", description: "This" },
    { type: "BOp", name: "Business procedure 51", description: "This" },
    { type: "BOp", name: "Business procedure 52", description: "This" },
  ];

  const navigateToFavorite = () : void => { navigation.navigateTo("/mapibox"); };
</script>

<div id="favorite-bar">
  {#if favorites.length === 0}
    <div class="empty-favorites"> When you star something, it will apear here. </div>
  {:else}
    {#each favorites as favoriteItem}
      <div class="favorite-item" on:click="{navigateToFavorite}">
        <div class="title"> {favoriteItem.name} </div>
        <div class="description"> {favoriteItem.description} </div>
      </div>
    {/each}
  {/if}
</div>

<style lang="scss">
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