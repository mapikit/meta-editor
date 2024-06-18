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

<div class="flex-1">
  <div class="w-full outline-none transition-all h-6 px-2 rounded bg-norbalt-300 border border-norbalt-100 hover:border-offWhite focus:border-offWhite grid grid-cols-[22px_4px_22px_4px_44px]">
    <FlatNumberField bind:value={day} updateFunction={setTime} max={lastPossibleDayOfMonth} min={1}/>
    <p>/</p>
    <FlatNumberField bind:value={month} updateFunction={setTime} min={1} max={12}/>
    <p>/</p>
    <FlatNumberField bind:value={year} updateFunction={setTime} />
  </div>
</div>
