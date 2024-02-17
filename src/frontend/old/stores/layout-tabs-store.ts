import { derived, writable } from "svelte/store";

export const guideText = writable("This is just a sample text.");
export const selectedService = writable("");

export const layoutTabs = writable({
  serviceSelectorOpen: false,
});

export const services = [
  { name: "editor", link: "/editor", icon: "editor-icon.svg", tooltip: "editor - Create and edit systems" },
];

export const contentLeftMargin = derived(layoutTabs, ($layoutTabs) => {
  // Should add later on to calculate the distance with each new and different open tab
  return $layoutTabs.serviceSelectorOpen ? 86 : 12;
});
