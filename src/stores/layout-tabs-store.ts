import { derived, writable } from "svelte/store"

export const guideText = writable("This is just a sample text.")
export const selectedService = writable("");
export const selectedSystem = writable("");

export const layoutTabs = writable({
  serviceSelectorOpen: false,
});

export const services = [
  { name: "Mapibox", link: "/mapibox", icon: "mapibox-icon.svg", tooltip: "Mapibox - Create and edit systems" },
  { name: "Mapicloud", link: "/something-else", icon: "mapicloud-icon.svg", tooltip: "Mapicloud - Run your systems in a ready-to-go cloud platform" }
];

export const contentLeftMargin = derived(layoutTabs, ($layoutTabs) => {
  // Should add later on to calculate the distance with each new and different open tab
  return $layoutTabs.serviceSelectorOpen ? 86 : 12;
})
