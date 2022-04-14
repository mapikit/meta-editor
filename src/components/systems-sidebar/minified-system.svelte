<script lang="ts">
  export let systemName = "AlgumNome";
  let systemId = "algum id" // To be used in the future to navigate to the system page onClick

  const systemMiniName = (name : string) : string => {
    const splited = ''
    // In the future to create dinamically a "mini name" for the system
    // Must be at most 2 characters long
    return name.slice(0,2)
  }
</script>

<div class="mini-system">
  <div class="name">
    <span> {systemMiniName(systemName)} </span>
  </div>
</div>

<style lang="scss">
  .mini-system {
    border-radius: 8px;
    height: 62px;
    width: 66px;
    background-color: #10101c;
    margin-top: 12px;
    font-family: 'Dosis';
    font-weight: 600;
    padding: 20px 4px 4px 4px;

    .name {
      background-color: #1a1a2a;
      width: 100%;
      border-radius: 0 0 3px 3px;
      text-align: center;
      font-size: 27px;
      height: 100%;
      // padding-top: 6px;
      color: #2d2d47;
    }
  }
</style>