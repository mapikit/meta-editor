<script lang="ts">
  export let title = "Título Teste";
  export let creationDate = new Date();
  export let updateDate = new Date();
  export let description = "Sample Description";

  const showDate = (date : Date) : string => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  let isOpen = false;
  let isEditing = false; // Later we will need a function to save in DB
</script>

<div class="main-card">
  <div class="header" on:click={() => { isOpen = !isOpen }}>
    <div class="{!isOpen ? "chevron-collapse" : "chevron-collapse down"}">
      <img src="/icon-chevron-up.svg" alt="chevron"/>
    </div>
    <div class="propname">
      <div class="favorite-icon">
        **
      </div>
      <h2> {title} </h2>
      <div class="pencil-icon" on:click={(e) => { isEditing = !isEditing; e.stopPropagation() }}>
        /..
      </div>
    </div>
    <!-- star - name - pencil -->
    <!-- lock >> -->
  </div>
  {#if isOpen}
    <div class={isEditing ? "editable-description" : "solid-description"}
      contenteditable="{isEditing}"
      on:click="{(e) => { if (isEditing) e.stopPropagation() }}"
    >
      {description}
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

      editButton
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
      margin-right: 12px;
    }

    .pencil-icon {
      margin-left: 12px;
    }
  }

  .main-card {
    position: relative;
    padding: 8px;
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
      width: 100%;
      cursor: pointer;
      display:  flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
    }

    .body {
      width: 150px;
    }

    .stats-group {
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
    background-color: #222233;
    padding: 8px;
    color: #e6e6fe;
    outline: none;
    transition: 500ms;
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
</style>