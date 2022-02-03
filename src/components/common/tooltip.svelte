<script lang="ts">
  export let tooltipContent : string = "%NOTOOLTIPTEXTPROVIDED%";
  // To externally set visibility
  export let visible : boolean = false;

  // To stop rendering the tooltip in a delay
  let present = visible

  const updatePresenceVisibility = (visibility : boolean) => {
    setTimeout(() => present = visibility, 400);
  }

  $: {
    updatePresenceVisibility(visible);
  }

</script>

{#if visible || present}
  <div class="{visible && present ? "tooltip-holder" : "tooltip-holder out"}">
    <div class="content">
      <div class="arrow" />
      {tooltipContent}
    </div>
  </div>
{/if}

<style lang="scss">
  .tooltip-holder {
    position: absolute;
    right: -12px;
    top: 50%;
    transition: all 150ms .2s;
    opacity: 1;

    &.out {
      opacity: 0;
    }

    .content {
      transform: translateY(-50%);
      position: fixed;
      z-index: 5;
      padding: 12px;
      border-radius: 8px;
      background-color: #2c2c44;
      max-width: 350px;
      font-family: 'Dosis';
      font-weight: 600;
      transform-origin: center center;
      box-shadow: 0 3px 6px rgba($color: #000000, $alpha: .8);
    }

    .arrow {
      transform-origin: center center;
      background-color: #2c2c44;
      width: 14px;
      height: 14px;
      border-radius: 2px;
      position: absolute;
      left: -5px;
      top: calc(50% - 7px);
      transform: rotate(45deg);
    }
  }
</style>