<script lang="ts">
  export let value = 0;
  let latestValidValue = value;
  export let max : number = undefined;
  export let min : number = undefined;
  export let updateFunction = () => {};

  const preventLettersAndOverflow = (node, evaluationValue)  => {
    return {
      update: (changingValue) => { // Is executed if a change is detected in the field
        if (value === null) {
          value = latestValidValue;
          return;
        }

        if (max && value > max) { value = max; }
        if (max && value < min) { value = min; }

        latestValidValue = value;
      },
    };
  };
</script>

<input type="number" {max} {min} bind:value="{value}" on:change="{updateFunction}" use:preventLettersAndOverflow="{value}"/>

<style lang="scss">
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
    text-align: center;

    &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
  }
</style>