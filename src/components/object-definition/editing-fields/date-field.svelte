<script lang="ts">
  import FlatNumberField from "./flat-number-field.svelte";

  export let propValue : Date;
  export let updateFunction = () => {};

  propValue = new Date();
  let day = propValue.getDate();
  let month = propValue.getMonth() + 1;
  let lastSetMonth = month;
  let year = propValue.getFullYear();
  let lastSetYear = year;

  const setTime = () => {
    // Had to duplicate this because the $ thingy does not work if not on the svelte body
    const lastValidDayOfMonth = new Date(new Date()
      .setFullYear(year, month, 0))
      .getDate();

    // Also automatically sets the day to a valid day if it is outside the month boundaries
    if (month !== lastSetMonth && day > lastValidDayOfMonth) { day = lastValidDayOfMonth; }
    if (year !== lastSetYear && day > lastValidDayOfMonth) { day = lastValidDayOfMonth; }

    propValue = new Date(new Date().setFullYear(year, month - 1, day));
    lastSetMonth = propValue.getMonth() + 1;
    lastSetYear = propValue.getFullYear();
    updateFunction();
  };

  $: lastPossibleDayOfMonth = new Date(new Date()
    .setFullYear(propValue.getFullYear(), propValue.getMonth() + 1, 0))
    .getDate();
;
</script>

<div class="value-input">
  <div class="date-input">
    <FlatNumberField bind:value={day} updateFunction={setTime} max={lastPossibleDayOfMonth} min={1}/>
    <p>/</p>
    <FlatNumberField bind:value={month} updateFunction={setTime} min={1} max={12}/>
    <p>/</p>
    <FlatNumberField bind:value={year} updateFunction={setTime} />
  </div>
  <p class="format"> DD / MM / YYYY </p>
</div>

<style lang="scss">
  .value-input {
    padding: 4px;
    background-color: #323248;
    border-radius: 0 0px 6px 6px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .date-input {
      display: grid;
      grid-template-columns: 22px 4px 22px 4px 44px;
      column-gap: 2px;
    }

    .format {
      color: #747492;
      font-size: 14px;
      align-self: center;
      text-align: center;
      width: 100%;
    }
    
  }
</style>