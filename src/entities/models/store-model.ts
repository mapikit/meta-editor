import { Readable } from "svelte/store";
import { EditorEntityValue } from "./editor-entity-value";
import { nanoid } from "nanoid";

/** Store Model of an entity's public fields */
export type StoreModel<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T as T[K] extends (...args : any[]) => any ? never : K] : Readable<T[K]>;
};

/** Ensures things are stores all the way through :) */
export type StoreEntityModel<T extends EditorEntityValue> = {
  [K in keyof T] : T[K] extends Function ? never
    : K extends "identifier" ? T[K]
      : T[K] extends Array<EditorEntityValue> ? Readable<StoreEntityModel<T[K][0]>[]>
        : Readable<T[K]>;
} & { toEntity : () => T; };

export const newEmptyStoreEntityModel = () : StoreEntityModel<EditorEntityValue> => {
  const usedId = nanoid();
  const emptyStoreEntityModel = { identifier: usedId, toEntity: () => ({ identifier: usedId }) };
  return emptyStoreEntityModel;
};
