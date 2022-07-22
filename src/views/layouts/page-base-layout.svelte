<script>
  import Header from "../../components/common/header.svelte";
  import ServiceSelector from "../../components/common/service-selector.svelte";

</script>
<div class="w-full h-full overflow-hidden">
  <Header />
  <ServiceSelector />
  <div class="w-full h-full pt-14 pl-4 bg-norbalt-300" >
    <slot></slot>
  </div>
</div>
