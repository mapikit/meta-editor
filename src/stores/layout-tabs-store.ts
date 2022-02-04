import { derived, writable } from "svelte/store"

export const layoutTabs = writable({
  serviceSelectorOpen: true,
});

export const contentLeftMargin = derived(layoutTabs, ($layoutTabs) => {
  // Should add later on to calculate the distance with each new and different open tab
  return $layoutTabs.serviceSelectorOpen ? 86 : 12;
})

export const openServiceSelector = () : void => layoutTabs.update((current) => {
  return {...current, serviceSelectorOpen: true}
});

export const closeServiceSelector = () : void => layoutTabs.update((current) => {
  return {...current, serviceSelectorOpen: false}
});
