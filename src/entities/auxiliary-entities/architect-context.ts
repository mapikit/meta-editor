import { writable } from "svelte/store";

export class ArchitectContext {
  public storeModalOpen = writable(false);
  public storeModalContent = writable("");
  public mouseOverStore = writable(false);
  public mouseOverModule = writable(undefined);
};
