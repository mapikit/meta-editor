/* eslint-disable max-classes-per-file */
import { Writable, writable } from "svelte/store";
import { IconToolboxData } from "../models/view-related/icon-toolbox";

class GlobalHeaderDataStore {
  public readonly title : Writable<string> = writable("Meta-Editor");
  public readonly iconToolboxes : Writable<IconToolboxData[]> = writable([]);
}

export const globalHeaderStore = new GlobalHeaderDataStore();
