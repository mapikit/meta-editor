<script lang="ts">
  export let ref : HTMLDivElement;
  let clientWidth : number
</script>

<div bind:this={ref} class="tab" bind:clientWidth style="height: {clientWidth}px;">
  <div class="icon" >
    <slot></slot>
  </div>
</div>

<style lang="scss">
  .tab {
    user-select: none;
    margin: 2px;
    display: block;
    text-align: center;
    border-radius: 5px 5px 5px 5px;
    transition-duration: 200ms;
  }

  .tab:hover {
    background-color: gray;
    transition-duration: 200ms;
  }

  .icon {
    position: relative;
    color: red;
    font-size: 20;
  }
</style>