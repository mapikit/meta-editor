import { Writable } from "svelte/store";
import { EditorEntityValue } from "./editor-entity-value";
import { nanoid } from "nanoid";

/** Store Model of an entity's public fields */
export type StoreModel<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T as T[K] extends (...args : any[]) => any ? never : K] : Writable<T[K]>;
};

/** Ensures things are stores all the way through :) */
export type StoreEntityModel<T extends EditorEntityValue> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T as T[K] extends (...args : any[]) => any ? never : K] :
  K extends "identifier" ? string
    : T[K] extends Array<EditorEntityValue> ? Writable<StoreEntityModel<T[K][0]>[]>
      : Writable<T[K]>;
} & { toEntity : () => T; };

export const newEmptyStoreEntityModel = () : StoreEntityModel<EditorEntityValue> => {
  const usedId = nanoid();
  const emptyStoreEntityModel = { identifier: usedId, toEntity: () => ({ identifier: usedId }) };
  return emptyStoreEntityModel;
};
