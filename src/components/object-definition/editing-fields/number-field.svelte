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

<div class="flex-1">
  <input use:preventLetters="{propValue}"
    class="w-full outline-none transition-all h-6 px-2 rounded bg-norbalt-300 border border-norbalt-100 hover:border-offWhite focus:border-offWhite" bind:value="{propValue}" on:change="{updateFunction}"/>
</div>
