<script>
  import Header from "../../components/common/header.svelte";
  import ServiceSelector from "../../components/common/service-selector.svelte";

</script>
<div class="layout">
  <Header />
  <ServiceSelector />
  <div class="general-content" >
    <slot></slot>
  </div>
</div>

<style lang="scss">
  .layout {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .general-content {
    padding-top: 48px;
    padding-left: 12px;
    height: 100%;
    width: 100%;
  }
</style>