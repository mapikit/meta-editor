import { Readable } from "svelte/store";
import { EditorEntityValue } from "./editor-entity-value";

/** Store Model of an entity's public fields */
export type StoreModel<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T as T[K] extends (...args : any[]) => any ? never : K] : Readable<T[K]>;
};

export type StoreEntityModel<T extends EditorEntityValue> = {
  [K in keyof T] : T[K] extends Function
    ? never : K extends "identifier" ? T[K] : Readable<T[K]>;
} & { toEntity : () => T; };
