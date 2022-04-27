<script lang="ts">
  import { guideText } from "../../stores/layout-tabs-store";
  import { cubicInOut } from "svelte/easing";

  let currentText = "";
  guideText.subscribe((value) => {
    currentText = value;
  });

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,max-lines-per-function
  const customFly = (node, {
    delay = 0,
    duration = 400,
    x = 0,
    y = 0,
  }) => {
    return {
      delay,
      duration,
      css: (t : number) : string => {
        let easedOpacity = cubicInOut(t);
        let easedX = cubicInOut((1 - t))  * x;
        let easedY = cubicInOut((1 - t))  * y;

        return `transform: translate(${easedX}px, ${easedY}px);
			  opacity: ${easedOpacity}`;
      },
    };
};
</script>

<div class="guide-text-container">
  {#key currentText}
    <h1 class="guide-text" in:customFly="{{ x: -50, duration: 460, delay: 160 }}" out:customFly="{{ x: -50, duration: 150 }}">
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

    right: 36px;
    top: 120px;

    .guide-text {
      position: absolute;
      right: 0;
      top: 0;
      width: 550px;
      user-select: none;
      -moz-user-select: none;
    }

    h1 {
      color: #2c2c3d;
      max-width: 550px;
      animation: intro 1.5s ease-in-out forwards;
      // animation-delay: 160ms;
      text-align: right;
    }
  }
</style>
