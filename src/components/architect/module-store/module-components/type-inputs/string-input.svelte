<script lang="ts">
  export let value : string;
</script>

<input type="text" class="input" bind:value/>

<style lang="scss">
  .input {
    background-color: aqua;
  }
</style>