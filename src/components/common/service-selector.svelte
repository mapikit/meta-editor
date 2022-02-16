<script lang="ts">
  import ServiceIcon from "./service-icon.svelte";
  import { layoutTabs, selectedService, services } from "../../stores/layout-tabs-store";
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  
  // Syncs selected with current page
  page.subscribe((pageData) => {
    if (pageData.url.pathname !== "/home") {
      layoutTabs.set({ serviceSelectorOpen: false });

      selectedService.set(services.find((service) => {
        return pageData.url.pathname.includes(service.link)
      })?.name ?? "");
    } else {
      layoutTabs.set({ serviceSelectorOpen: true });
      selectedService.set("");
    }
  })

  let collapsed = false;
  layoutTabs.subscribe((value) => { collapsed = !value.serviceSelectorOpen; })

  let selected = "";
  selectedService.subscribe((value) => {
    selected = value
  })

  const select = (serviceName : string, link : string) : void => {
    selectedService.set(serviceName);
    goto(link)
  }

</script>

<div class="{collapsed && selected !== "" ? "service-select collapsed" : "service-select"}"
  on:mouseleave="{() => layoutTabs.update((value) => ({ serviceSelectorOpen: false && selected !== ""}))}"
  on:mouseenter="{() => layoutTabs.update((value) => ({ serviceSelectorOpen: true && selected !== ""}))}"
>
  {#each services as service}
    <ServiceIcon
      selectFunction={() => select(service.name, service.link)}
      selected={selected}
      service={service}
    />
  {/each}
</div>

<style lang="scss">
  .service-select {
    margin-top: 48px;
    height: calc(100vh - 48px);
    width: 84px;
    background-color: #5d2be6;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    padding: 16px 0 0 14px;
    transition: all 250ms;
    position: fixed;
    z-index: 5;

    &.collapsed {
      margin-left: -72px;
      transition: all 250ms .5s;
    }
  }

</style>