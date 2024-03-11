import { Writable, writable } from "svelte/store";

class GenericLayoutStateStore {
  public readonly ready : Writable<boolean> = writable(false);
  public readonly loading : Writable<boolean> = writable(false);
  public readonly error : Writable<string> = writable(null);
}

export default new GenericLayoutStateStore();
