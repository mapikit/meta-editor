<script lang="ts">
  import { guideText } from "../../stores/layout-tabs-store";
  import { fly } from "svelte/transition";

  let currentText = "";
  guideText.subscribe((value) => {
    currentText = value
  })
</script>

<div class="guide-text-container">
  {#key currentText}
    <h1 class="guide-text" in:fly="{{ x: -50, duration: 460, delay: 160 }}" out:fly="{{ x: -50, duration: 150 }}">
      {currentText}
    </h1>
  {/key}
</div>

<style lang="scss">
  @keyframes intro {
    0% { color: #2c2c3d }
    15% { color: #5e5e6d }
    100% { color: #2c2c3d }
  }

  .guide-text-container {
    position: fixed;
    font-family: "Dosis";
    font-size: 16px;
    font-weight: 900;
    user-select: none;
    -moz-user-select: none;

    right: 36px;
    top: 120px;

    h1 {
      color: #2c2c3d;
      max-width: 550px;
      animation: intro 1.5s ease-in-out forwards;
      // animation-delay: 160ms;
      text-align: right;
    }
  }
</style>
