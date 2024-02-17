import type { Readable } from "svelte/store";

type NotAFunction<T> = {
  [K in keyof T] : T[K] extends Function ? never : K;
}[keyof T]



export type Serialized<
  Type,
  Exclude extends keyof Pick<Type, NotAFunction<Type>> = undefined,
  Optional extends keyof Omit<Pick<Type, NotAFunction<Type>>, Exclude> = undefined> = Type extends Function ? never :
    Type extends Array<infer L> ? Array<Serialized<L>> :
      Type extends Readable<infer J> ? Serialized<J> :
        Type extends object ? SerializedObject<Omit<Type, Exclude | Optional> & Partial<Pick<Type,Optional>>> :
          Type;

type SerializedObject<T> = {
  [key in keyof Pick<T, NotAFunction<T>>] : Serialized<T[key]>;
}
