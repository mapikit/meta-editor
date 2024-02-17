import { contextBridge, ipcRenderer } from "electron";
import { ElectronFileSystem } from "./file-system.js";
import { PromiseInternal } from "../common/types/injected-window";

const obj = Object.assign({}, ...ElectronFileSystem["exposed"]
  .map((method : string) => ({ [method]: (...args) => ipcRenderer.invoke(method, ...args) })));

contextBridge.exposeInMainWorld(
  "fileApi", obj as PromiseInternal<Omit<typeof ElectronFileSystem, "prototype">>,
);
