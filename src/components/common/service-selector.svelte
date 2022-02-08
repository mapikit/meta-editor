<script lang="ts">
  import ServiceIcon from "./service-icon.svelte";
  import { layoutTabs, selectedService } from "../../stores/layout-tabs-store";
  import { goto } from '$app/navigation';

  let collapsed = false;
  layoutTabs.subscribe((value) => { collapsed = !value.serviceSelectorOpen; })

  const services = [
    { name: "Mapibox", link: "/mapibox", icon: "mapibox-icon.svg", tooltip: "Mapibox - Create and edit systems" },
    { name: "Mapicloud", link: "/something-else", icon: "mapicloud-icon.svg", tooltip: "Mapicloud - Run your systems in a ready-to-go cloud platform" }
  ];

  let selected = "";
  selectedService.subscribe((value) => {
    selected = value
  })

  const select = (serviceName : string, link : string) : void => {
    selectedService.set(serviceName);
    goto(link, { replaceState: true })
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