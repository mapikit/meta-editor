<script lang="ts">
  import ServiceIcon from "./service-icon.svelte";
  import { layoutTabs, selectedService, services } from "../../stores/layout-tabs-store";
  import { navigation } from "../../lib/navigation";
  
  // Syncs selected with current page
  navigation.pathStore.subscribe((path : string) => {
    if (path === "/home" || path === "/" || path === "") {
      layoutTabs.set({ serviceSelectorOpen: true });
      selectedService.set("");
    } else {
      layoutTabs.set({ serviceSelectorOpen: false });

      selectedService.set(services.find((service) => {
        return path.includes(service.link);
      })?.name ?? "");
    }
  });

  let collapsed = false;

  const select = (serviceName : string, link : string) : void => {
    selectedService.set(serviceName);
    navigation.navigateTo(link);
  };

  let collapsedClass = "";
  let isHome = $selectedService === "";
  $: collapsedClass = collapsed ? "-translate-x-20 delay-500" : "";
  $: isHome = $selectedService === "";

  layoutTabs.subscribe((value) => {
    collapsed = !isHome && !value.serviceSelectorOpen;
  });

</script>

<div
  class="w-24 bg-norbalt-200 h-full flex flex-col justify-start content-center mt-14 fixed transition-all duration-300 z-10 {collapsedClass}"
  on:mouseleave="{() => layoutTabs.set({ serviceSelectorOpen: false })}"
  on:mouseenter="{() => layoutTabs.set({ serviceSelectorOpen: true })}"
>
  {#each services as service}
    <ServiceIcon
      selectFunction={() => select(service.name, service.link)}
      selected={$selectedService}
      service={service}
    />
  {/each}
</div>
