import { contextBridge, ipcRenderer } from "electron";
import { ElectronFileSystem } from "./file-system.js";
import { PromiseInternal } from "../common/types/injected-window";

const obj = Object.assign({}, ...ElectronFileSystem["exposed"]
  .map((method : string) => ({ [method]: (...args) => {
    return ipcRenderer.invoke(method, ...args);
  } })));

// Makes the programmer get pretty notifications when they forget to add the decorator
Object.getOwnPropertyNames(ElectronFileSystem).filter(method =>
  !ElectronFileSystem["exposed"].includes(method) && typeof ElectronFileSystem[method] === "function")
  .forEach((method) => {
    obj[method] = () => {
      throw Error("The method '"
        + method
        + "' was not exposed! If you wish to expose it, use @exposeInWindow decorator!");
    };
  });

contextBridge.exposeInMainWorld(
  "fileApi", obj as PromiseInternal<Omit<typeof ElectronFileSystem, "prototype">>,
);
