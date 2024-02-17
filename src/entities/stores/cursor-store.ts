import { Writable, writable } from "svelte/store";

// Application-Level Model - Singleton
class CursorStore {
  public readonly position : Writable<{x : number, y : number}> = writable({ x: 0, y: 0 });
  public readonly styleStack : Writable<string[]> = writable([]);
}

export default new CursorStore();
