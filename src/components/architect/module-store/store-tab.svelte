<script lang="ts">
  export let ref : HTMLDivElement;
  let clientWidth : number;
</script>

<div bind:this={ref} class="tab" bind:clientWidth style="height: {clientWidth}px;">
  <div class="icon" >
    <slot></slot>
  </div>
</div>

<style lang="scss">
  .tab {
    position: relative;
    user-select: none;
    margin: 2px;
    display: block;
    text-align: center;
    border-radius: 5px 5px 5px 5px;
    padding: 18px;
    transition-duration: 200ms;
  }

  .tab:hover {
    background-color: gray;
    transition-duration: 200ms;
  }

  .icon {
    position: absolute;
    color: red;
    left: -37%;
    top: -32%;
    font-size: 20;
    transform: scale(0.7);
  }
</style>