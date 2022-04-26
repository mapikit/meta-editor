<script lang="ts">
  type PositionInfo = [number, number, string]
  export let [xStart, xSpread, xValueType] : PositionInfo = [10,30, "%"];
  export let [yStart, ySpread, yValueType] : PositionInfo = [-10,-30, "%"];
  export let [minRotation, maxRotation] = [-180, 180];
  
  const direction = () => {
    const d = ["normal", "reverse"][Math.floor(Math.random()* 2)];
    return d;
  };

  const rotationCssVar = `--varrotate: ${Math.random()*maxRotation}deg`;
</script>

<div class="pebble" style="{`
  bottom: ${yStart-ySpread*Math.random()}${yValueType};
  left: ${xStart+xSpread*Math.random()}${xValueType};
  animation-direction: ${direction()};
  animation-delay: ${2*Math.random()}s;
  ${rotationCssVar}
`,}">
  <slot></slot>
</div>

<style lang="scss">
  .pebble {
    animation: float 10s infinite;
    position: absolute;
    transform: rotate(var(--varrotate));
  }

  @keyframes float {
    0%  { transform: translateY(0px) rotate(var(--varrotate)); animation-timing-function: ease-out; }
    25%  { transform: translateY(25px) rotate(var(--varrotate)); animation-timing-function: ease-in; }
    50%  { transform: translateY(0px) rotate(var(--varrotate)); animation-timing-function: ease-out; }
    75%   { transform: translateY(-25px) rotate(var(--varrotate)); animation-timing-function: ease-in; }
    100%  { transform: translateY(0px) rotate(var(--varrotate)); animation-timing-function: linear; }
  }
</style>