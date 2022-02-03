<script lang="ts">
  import ServiceIcon from "./service-icon.svelte";
import Tooltip from "./tooltip.svelte";

  export let collapsed : boolean = false;

  const services = [
    { name: "Mapibox", link: "something", icon: "mapibox-icon.svg", tooltip: "Mapibox - Create and edit systems" },
    { name: "Mapicloud", link: "something-else", icon: "mapicloud-icon.svg", tooltip: "Mapicloud - Run you systems in a ready-to-go cloud platform" }
  ];

  let selected = "";

  const select = (serviceName : string) : void => {
    selected = serviceName;
  }
</script>

<div class="{collapsed ? "service-select collapsed" : "service-select"}"
  on:mouseleave="{() => collapsed = true}"
  on:mouseenter="{() => collapsed = false}"
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
    position: fixed;
    transition: all 250ms;

    &.collapsed {
      margin-left: -72px;
      transition: all 250ms .5s;
    }
  }

</style>