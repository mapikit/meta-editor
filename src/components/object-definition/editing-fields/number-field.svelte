<script lang="ts">
  export let propValue = 0;
  let latestValidValue = propValue;
  export let updateFunction = () => {};

  const preventLetters = (node, evaluationValue)  => {
    return {
      update: (value) => { // Is executed if a change is detected in the field
        if (value === null) {
          propValue = latestValidValue;
          return;
        }

        latestValidValue = propValue;
      },
    };
  };
</script>

<div class="value-input">
  <input type="number" bind:value="{propValue}" on:change="{updateFunction}" use:preventLetters="{propValue}"/>
</div>

<style lang="scss">
  .value-input {
    padding: 4px;
    background-color: #323248;
    border-radius: 0 0px 6px 6px;

    input {
      width: 100%;
      font-family: 'Dosis';
      background-color: transparent;
      border: none;
      outline: none;
      font-size: 16px;
      color: white;
      padding-left: 6px;
      -moz-appearance: textfield;

      &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
        -webkit-appearance: none;
      }
    }
  }
</style>