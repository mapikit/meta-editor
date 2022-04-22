<script lang="ts">
import LockIcon from "../common/icons/lock-icon.svelte";
import PencilIcon from "../common/icons/pencil-icon.svelte";
import StarIcon from "../common/icons/star-icon.svelte";
import ToolsConfigIcon from "../common/icons/tools-config-icon.svelte";

  export let title = "Título Teste";
  export let creationDate = new Date();
  export let updateDate = new Date();
  export let description = "Sample Description";
  export let favorited = false;
  export let locked = false;

  const showDate = (date : Date) : string => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  let isOpen = false;
  let isEditing = false;
  // Later we will need a function to save in DB

  const updateFavorited = (event: MouseEvent) => {
    event.stopPropagation();
    favorited = !favorited;
    // Later we will also need a function to update the favorited status of the property too
  }

  const updateLocked = (event: MouseEvent) => {
    event.stopPropagation();
    locked = !locked;
  }
</script>

<div class="main-card">
  <div class="header" on:click={() => { isOpen = !isOpen }}>
    <div class="{!isOpen ? "chevron-collapse" : "chevron-collapse down"}">
      <img src="/icon-chevron-up.svg" alt="chevron"/>
    </div>
    <div class="propname">
      <div class="favorite-icon" on:click={updateFavorited}>
        <StarIcon active={favorited} iconColor={"#575777"} scale={1.5}/>
      </div>
      <h2> {title} </h2>
      <div class="pencil-icon" on:click={(e) => { isEditing = !isEditing; e.stopPropagation() }}>
        <PencilIcon iconColor={"#575777"} scale={1.4}/>
      </div>
      <div class="lock-icon" on:click={updateLocked}>
        <LockIcon locked={locked} iconColor={locked ? "#f39d26" : "#575777"} scale={1.2}/>
      </div>
    </div>
  </div>
  {#if isOpen}
    <div class="description-container">
      <div class={isEditing ? "editable-description" : "solid-description"}
      contenteditable="{isEditing}"
      on:click="{(e) => { if (isEditing) e.stopPropagation() }}"
      >
        {description}
      </div>
    </div>
    <div class="body">
      <div class="stats-group">
        <div class="stat-line">
          <p class="key"> Last Edited: </p> <p class="value"> {showDate(updateDate)} </p>
        </div>
        <div class="stat-line">
          <p class="key"> Creation Date: </p> <p class="value"> {showDate(creationDate)} </p>
        </div>
      </div>

      <div class="edit-button">
        <div class="edit-icon">
          <ToolsConfigIcon iconColor="#3b3b53" scale={1.3}/>
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .propname {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;

    .favorite-icon {
      padding-top: 3px;
      margin-right: 12px;
    }

    .pencil-icon {
      padding-top: 6px;
      margin-left: 12px;
    }

    .lock-icon {
      position: absolute;
      right: 16px;
      padding-top: 4px;
    };
  }

  .main-card {
    position: relative;
    margin-top: 12px;
    border-radius: 12px;
    width: 380px;
    font-size: 14px;
    font-family: 'Dosis';
    text-align: center;
    background-color: #1a1a2a;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    transition: 75ms all;

    &:hover {
      background-color: #2c2c44;
    }

    .header {
      padding: 8px;
      width: 100%;
      cursor: pointer;
      display:  flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
    }

    .body {
      width: 180px;
      padding: 0px 8px 8px 8px;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
    }

    .stats-group {
      width: 100%;
      margin-top: 16px;
    }

    .stat-line {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;

      p {
        color: #676799;
      }

      .value {
        color: white;
      }
    }
  }

  .editable-description {
    width: 100%;
    margin-top: 8px;
    border-radius: 12px;
    background-color: #13131f;
    padding: 12px;
    color: #e6e6fe;
    outline: none;
    transition: 180ms;
  }

  .solid-description {
    width: 100%;
    margin-top: 8px;
    border-radius: 12px;
    max-height: 55px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 12px;
    transition: 180ms;
  }

  .description-container {
    width: 100%;
    padding-left: 8px;
    padding-right: 8px;
  }

  .chevron-collapse {
    position: absolute;
    width: 20px;
    height: 20px;
    margin-top: 2px;
    margin-left: 0px;
    transform-origin: center;
    transform: rotate(90deg);
    transition: all 250ms;
    align-self: center;
    left: 16px;

    img {
      width: 80%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
      filter: brightness(100);
    }

    &.down {
      transform: rotate(180deg);
    }
  }

  .edit-button {
    --height: 38px;
    margin-top: 12px;
    background-color: #13131f;
    border-radius: calc(var(--height) / 2);
    height: var(--height);
    width: 120px;
    text-align: center;
    justify-self: center;

    .edit-icon {
      // margin-top: 50%;
      transform: translateY(40%);
    }
  }
</style>