<script lang="ts">
  import type { Writable } from "svelte/store";
  
  //This file exists simply because it is impossible to have $obj.prop >:(

  export let valueStore : Writable<unknown>;

</script>

<input class="edit-value" bind:value={$valueStore}/>

<style lang="scss">
  .edit-value {
    font-size: 14px;
    font-family: "Dosis";
    text-align: right;

    border-radius: 4px;
    border: none;
    background-color: #13131f;
    padding: 4px;
    color: white;
    outline: none;
  }
</style>