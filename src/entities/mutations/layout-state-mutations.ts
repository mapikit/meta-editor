import genericLayoutStateStore from "../stores/generic-layout-state-store";

export class GenericLayoutStateMutations {
  public static reset () : void {
    genericLayoutStateStore.error.set(null);
    genericLayoutStateStore.loading.set(false);
    genericLayoutStateStore.ready.set(false);
  }

  public static setLoading () : void {
    genericLayoutStateStore.error.set(null);
    genericLayoutStateStore.loading.set(true);
    genericLayoutStateStore.ready.set(false);
  }

  public static setError (message : string) : void {
    genericLayoutStateStore.error.set(message);
    genericLayoutStateStore.loading.set(false);
    genericLayoutStateStore.ready.set(true);
  }

  public static setDone () : void {
    genericLayoutStateStore.error.set(null);
    genericLayoutStateStore.loading.set(false);
    genericLayoutStateStore.ready.set(true);
  }
}
