import { BrowserWindow, ipcMain } from "electron";

import path from "path";
import { fileURLToPath } from "url";
import { ElectronFileSystem } from "./file-system.js";

export default class Main {
  static mainWindow : Electron.BrowserWindow;
  static application : Electron.App;
  static BrowserWindow;
  private static onWindowAllClosed () : void {
    if (process.platform !== "darwin") {
      Main.application.quit();
    }
  }

  private static onClose () : void {
    // Dereference the window object.
    Main.mainWindow = null;
  }

  // eslint-disable-next-line max-lines-per-function
  private static onReady () : void {
    Main.createIPCHandlers();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    Main.mainWindow = new Main.BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, "preload.mjs"),
        sandbox: false,
      },
    });


    const mode = process.env.NODE_ENV;

    const url = mode === "production" ?
      `file://${path.join(__dirname, "../../dist/index.html")}` : "http://localhost:3000/";
    // in dev, target the host and port of the local rollup web server
    // in production, use the statically build version of our application

    void Main.mainWindow.loadURL(url);
    Main.mainWindow.on("closed", Main.onClose);
  }

  private static createIPCHandlers () : void {
    for(const method of ElectronFileSystem["exposed"]) {
      console.log("Importing handler...");
      ipcMain.handle(method, (_event, ...args) => {
        console.log(_event, "0000");
        const execution = ElectronFileSystem[method](...args);
        if (execution instanceof Promise) {
          execution.catch(err => console.error(err));
        }
      });
    }
  }

  static main (app : Electron.App, browserWindow : typeof BrowserWindow) : void {
    Main.BrowserWindow = browserWindow;
    Main.application = app;
    Main.application.on("window-all-closed", Main.onWindowAllClosed);
    Main.application.on("ready", Main.onReady);
  }
}
