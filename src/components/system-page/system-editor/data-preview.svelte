<script lang="ts">
  export let data = {};

  let dataKeys = [];

  $: dataKeys = Object.keys(data);
</script>

<div class="view-container">
  {#each dataKeys as dataKey }
    <div class="property">
      <div class="name" > {dataKey} : </div>
      <div class="value" >
        {data[dataKey].toString()}
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  .view-container {
    margin-left: 22px;
    width: 410px;
    border-radius: 12px;
    background-color: #202031;
    overflow: hidden;
    padding: 16px;

    .property {
      margin-bottom: 5px;
    }
  }
</style>