<script lang="ts">
  export let propValue = "";
  export let standalone = false;
  export let updateFunction = () => {};
</script>

<div class={standalone ? "value-input rounded" : "value-input" }>
  <input bind:value="{propValue}" on:change="{updateFunction}"/>
</div>

<style lang="scss">
  .value-input {
    padding: 4px;
    background-color: #323248;
    border-radius: 0 0px 6px 6px;

    &.rounded {
      border-radius: 6px;
    }

    input {
      width: 100%;
      font-family: 'Dosis';
      background-color: transparent;
      border: none;
      outline: none;
      font-size: 16px;
      color: white;
      padding-left: 6px;
    }
  }
</style>