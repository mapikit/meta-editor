<script lang="ts">
import PebbleAnimation from "./pebble-animation.svelte";
import P1 from "./pebbles/p1.svelte";
import P2 from "./pebbles/p2.svelte";
import P3 from "./pebbles/p3.svelte";
import P4 from "./pebbles/p4.svelte";
import P5 from "./pebbles/p5.svelte";

let pebbles = [P1, P5, P4, P5, P4, P2, P1, P3, P2, P3];

const colors = ["#ffaf35", "#3cf691", "#df263a", "#41cff6", "#171730", "#313151"];
let usableColors = [...colors];

function getColor () : string {
  if(usableColors.length === 0) usableColors = [...colors];
  const randomIndex = Math.floor(Math.random()*usableColors.length);
  const selected = usableColors[randomIndex];
  usableColors.splice(randomIndex,1);
  return selected;
}

</script>
<div class="pebbles-holder">
  {#if pebbles !== undefined}
    {#each pebbles as Pebble}
      <PebbleAnimation xStart={10} xSpread={80} yStart={20} ySpread={20}>
        <Pebble color="{getColor()}" scale={1}/>
      </PebbleAnimation>
    {/each}
  {/if}
</div>

<style lang="scss">
  .pebbles-holder {
    position: absolute;
    width: 100%;
    overflow: visible;
    height: 30vh;
    bottom: 0;
  }
</style>
