// Customized HMR-safe stores
// Based off https://github.com/svitejs/svite/blob/ddec6b9/packages/playground/hmr/src/stores/hmr-stores.js
import type { Writable } from "svelte/store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let stores : Record<string, Writable<any>> = {};

// preserve the store across HMR updates
if (import.meta.hot) {
  if (import.meta.hot.data.stores) {
    stores = import.meta.hot.data.stores;
  }
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    import.meta.hot.data.stores = stores;
  });
}
