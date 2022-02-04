<script lang="ts">
  import { guideText } from "../../stores/layout-tabs-store";
  import { fly } from "svelte/transition";

  let currentText = "";
  let updateCount = 0;
  guideText.subscribe((value) => {
    currentText = value
    updateCount += 1;
  })
</script>

<div class="guide-text-container">
  {#key updateCount}
    <h1 class="guide-text" in:fly="{{ x: -50, duration: 460, delay: 160 }}" out:fly="{{ x: -50, duration: 150 }}" id="{updateCount.toString()}">
      {currentText}
    </h1>
  {/key}
</div>

<style lang="scss">
  .guide-text-container {
    position: fixed;
    font-family: "Dosis";
    font-size: 16px;
    font-weight: 900;
    color: #2c2c3d;
    user-select: none;
    -moz-user-select: none;

    right: 36px;
    top: 120px;

    h1 {
      max-width: 550px;
      text-align: right;
    }
  }
</style>
