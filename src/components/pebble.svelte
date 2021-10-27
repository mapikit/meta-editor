<script lang="ts">
  import P1 from "./pebbles/p1.svelte";
  import P2 from "./pebbles/p2.svelte";
  import P3 from "./pebbles/p3.svelte";
  import P4 from "./pebbles/p4.svelte";
  import P5 from "./pebbles/p5.svelte";

  type PositionInfo = [number, number, string]
  export let [xStart, xSpread, xValueType] : PositionInfo = [10,30, "%"];
  export let [yStart, ySpread, yValueType] : PositionInfo = [-10,-30, "%"];
  export let [minRotation, maxRotation] = [-60, 120]
  let pebbles = [P1, P5, P4, P5, P4, P2, P1, P3, P2, P3];
  const colors = ["#ffaf35", "#3cf691", "#df263a", "#41cff6", "#171730", "#313151"]
  let usableColors = [...colors];

  function getColor() {
    if(usableColors.length === 0) usableColors = [...colors];
    const randomIndex = Math.floor(Math.random()*usableColors.length);
    const selected = usableColors[randomIndex];
    usableColors.splice(randomIndex,1);
    return selected;
  }
  
  const direction = () => { 
    const d = ["normal", "reverse"][Math.floor(Math.random()* 2)];
    return d;
  }
</script>

{#if pebbles !== undefined}
  {#each pebbles as Pebble}
  <div class="pebble" style="{`
    bottom: ${yStart-ySpread*Math.random()}${yValueType};
    left: ${xStart+xSpread*Math.random()}${xValueType};
    rotate: ${Math.random()*maxRotation}deg !important;
    animation-direction: ${direction()};
    animation-delay: ${2*Math.random()}s;
    `}">
    <Pebble color="{getColor()}" scale={1}/>
  </div>
  {/each}
{/if}

<style lang="scss">
  .pebble {
    animation: float 10s infinite;
    position: absolute;
  }

  @keyframes float {
    0%  { rotate: inherit; transform: translateY(0px); animation-timing-function: ease-out; }
    25%  { rotate: inherit; transform: translateY(25px); animation-timing-function: ease-in; }
    50%  { rotate: inherit; transform: translateY(0px); animation-timing-function: ease-out; }
    75%   { rotate: inherit; transform: translateY(-25px); animation-timing-function: ease-in; }
    100%  { rotate: inherit; transform: translateY(0px); animation-timing-function: linear; }
  }
</style>