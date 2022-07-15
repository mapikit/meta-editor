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

<div class="fixed font-sans text-3xl font-black select-none right-9 top-28">
  {#key currentText}
    <h1 class="absolute right-0 top-0 w-[550px] text-right text-norbalt-100" in:customFly="{{ x: -50, duration: 460, delay: 160 }}" out:customFly="{{ x: -50, duration: 150 }}">
      {currentText}
    </h1>
  {/key}
</div>

<style lang="scss">
  @keyframes intro {
    0% { color: #3a394f }
    15% { color: #9191a1 }
    100% { color: #3a394f }
  }

  h1 {
    animation: intro 1.5s ease-in-out forwards;
    animation-delay: 160ms;
  }
</style>
