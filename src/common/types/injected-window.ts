import { ElectronFileSystem } from "../../electron/file-system";

export type PromiseInternal<T> = {
  [K in keyof T] : T[K] extends (...args : infer A) => infer R ? (...args : A) => Promise<R>: T[K]
}

/** DISCLAIMER: This will make it look like calling exposed methods are Promise<Promise<T>> */
export type ExposedInMainWorldType = {
  fileApi : PromiseInternal<Omit<typeof ElectronFileSystem, "prototype">>
}

export type InjectedWindow = typeof window & ExposedInMainWorldType

export function windowWasInjected (_window : unknown) : asserts _window is InjectedWindow {
  if(!_window["fileApi"]) throw Error("Missing electron injection of \"fileApi\"");
}
