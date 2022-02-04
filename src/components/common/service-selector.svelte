<script lang="ts">
  import ServiceIcon from "./service-icon.svelte";
  import { layoutTabs } from "../../stores/layout-tabs-store";

  let collapsed = false;
  layoutTabs.subscribe((value) => { collapsed = !value.serviceSelectorOpen; })

  const services = [
    { name: "Mapibox", link: "something", icon: "mapibox-icon.svg", tooltip: "Mapibox - Create and edit systems" },
    { name: "Mapicloud", link: "something-else", icon: "mapicloud-icon.svg", tooltip: "Mapicloud - Run your systems in a ready-to-go cloud platform" }
  ];

  let selected = "";

  const select = (serviceName : string) : void => {
    selected = serviceName;
  }

</script>

<div class="{collapsed && selected !== "" ? "service-select collapsed" : "service-select"}"
  on:mouseleave="{() => layoutTabs.update((value) => ({ serviceSelectorOpen: false && selected !== ""}))}"
  on:mouseenter="{() => layoutTabs.update((value) => ({ serviceSelectorOpen: true && selected !== ""}))}"
>
  {#each services as service}
    <ServiceIcon
      selectFunction={select}
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

    &.collapsed {
      margin-left: -72px;
      transition: all 250ms .5s;
    }
  }

</style>