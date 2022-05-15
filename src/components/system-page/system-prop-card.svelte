<script lang="ts">
import type { PropertyListEntry } from "../../common/types/property-list-entry";
import { get } from "svelte/store";

import LockIcon from "../common/icons/lock-icon.svelte";
import PencilIcon from "../common/icons/pencil-icon.svelte";
import StarIcon from "../common/icons/star-icon.svelte";
import EditableProperty from "./editable-property.svelte";
import SystemPropEditButton from "./system-prop-edit-button.svelte";

export let entry : PropertyListEntry;

let title = entry.name;
let creationDate = new Date();
let updateDate = new Date();
let description = entry.description;
let favorited = entry.starred;
let locked = entry.locked;
const id = entry.id;

console.log(get(entry.description));

let dataValues = entry.dataValues;

const showDate = (date : Date) : string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

let isOpen = false;
let isEditing = false;
// Later we will need a function to save in DB

const updateFavorited = (event : MouseEvent) : void => {
  event.stopPropagation();
  favorited.set(!$favorited);
  // Later we will also need a function to update the favorited status of the property too
};

const updateLocked = (event : MouseEvent) : void => {
  event.stopPropagation();
  locked.set(!$locked);
};
</script>

<div class="main-card">
  <div class="header" on:click={() => {
    if (isEditing) { return; }
    isOpen = !isOpen;
  }}>
    <div class="{!isOpen ? "chevron-collapse" : "chevron-collapse down"}">
      <img src="/icon-chevron-up.svg" alt="chevron"/>
    </div>
    <div class="propname">
      <div class="favorite-icon" on:click={updateFavorited}>
        <StarIcon active={$favorited} iconColor={"#575777"} scale={1.5}/>
      </div>
      {#if isEditing}
        <input on:click="{(e) => e.stopPropagation()}" class="title-edit title-width" bind:value={$title} >
      {:else}
        <h2 class="title-width"> {$title} </h2>
      {/if}
      <div class="pencil-icon" on:click={(e) => {
        isEditing = !isEditing; e.stopPropagation(); if (isEditing) { isOpen = true; } }}>
        <PencilIcon iconColor={"#575777"} scale={1.4}/>
      </div>
      <div class="lock-icon" on:click={updateLocked}>
        <LockIcon locked={$locked} iconColor={locked ? "#f39d26" : "#575777"} scale={1.2}/>
      </div>
    </div>
  </div>
  {#if isOpen}
    <div class="description-container">
      <div class={isEditing ? "editable-description" : "solid-description"}
      contenteditable="{isEditing}"
      on:click="{(e) => { if (isEditing) e.stopPropagation(); }}"
      >
        {$description}
      </div>
    </div>
    <div class="body">
      <div class="stats-group">
        {#each dataValues as dataValue}
          <div class="stat-line">
            <p class="key"> {dataValue.name}: </p>
            {#if isEditing}
              <EditableProperty valueStore={dataValue.value} />
            {:else}
              <p class="value"> {get(dataValue.value)} </p>
            {/if}
          </div>
        {/each}
      </div>
      <div class="stats-group">
        <div class="stat-line">
          <p class="key"> Last Edited: </p> <p class="value"> {showDate(updateDate)} </p>
        </div>
        <div class="stat-line">
          <p class="key"> Creation Date: </p> <p class="value"> {showDate(creationDate)} </p>
        </div>
      </div>

      <SystemPropEditButton id={$id} />
    </div>
  {/if}
</div>

<style lang="scss">
  .propname {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    flex: 1;

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

  .title-edit {
    border-radius: 8px;
    border: none;
    background-color: #13131f;
    padding: 4px;
    color: white;

    outline: none;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
  }

  .title-width {
    width: calc(100% - 186px);
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
    transition: 200ms all;
    padding-bottom: 8px;

    &:hover {
      background-color: #222235;
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
      width: calc(100% - 68px);
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
</style>