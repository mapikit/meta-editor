<script lang="ts">
  export let propValue = false;
  export let updateFunction = () => {};

  const toggle = () => {
    propValue = !propValue;
    updateFunction();
  };
</script>

<div class="value-input">
  <div class="{propValue ? "toggle-track on": "toggle-track"}" on:click="{toggle}">
    <div class="{propValue ? "toggle-ball on": "toggle-ball"}"></div>
  </div>
</div>

<style lang="scss">
  .value-input {
    padding: 4px;
    // background-color: #323248;
    border-radius: 0 0px 6px 6px;

    .toggle-track {
      cursor: pointer;
      height: 12px;
      width: 28px;
      margin: 3px 0 3px 50%;
      background-color: #10101a;
      border-radius: 6px;
      transform: translateX(-50%);
      transition: 100ms ease-in-out;

      &.on {
        background-color: #3cf691;
      }
    }

    .toggle-ball {
      border-radius: 50%;
      height: 14px;
      width: 14px;
      background-color: cornsilk;
      transform: translateX(-4px) translateY(-1px);
      transition: 100ms ease-in-out;
      box-shadow: 0 0 4px rgba($color: #000000, $alpha: 1);

      &.on {
        transform: translateX(18px) translateY(-1px);
      }
    }
  }
</style>