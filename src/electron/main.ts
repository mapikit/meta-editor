import { BrowserWindow, ipcMain, session } from "electron";

import path from "path";
import { fileURLToPath } from "url";
import { ElectronFileSystem } from "./file-system.js";

export default class Main {
  static mainWindow : Electron.BrowserWindow;
  static application : Electron.App;
  static BrowserWindow;
  static defaultPersistPath = "persist:default";
  static session : Electron.Session;

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
      width: 1200,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, "preload.mjs"),
        sandbox: false,
      },
    });

    Main.mainWindow.on("closed", Main.onClose);
  }

  private static loadMainPage () : void {
    const mode = process.env.NODE_ENV;
    const url = mode === "production" ?
      `file://${path.join(__dirname, "../../dist/index.html")}` : "http://localhost:3000/";
    // in dev, target the host and port of the local rollup web server
    // in production, use the statically build version of our application

    if (mode !== "production") {
      Main.mainWindow.webContents.openDevTools();
    }

    void Main.mainWindow.loadURL(url);
  }

  private static async loadExtensions () : Promise<void> {
    const mode = process.env.NODE_ENV;
    if (mode === "production") { return; }
    Main.session = session.fromPartition(this.defaultPersistPath);
    const sss = await import("electron-devtools-installer");

    // Add all extensions here
    await sss.default["default"]("apjeljpachdcjkgnamgppgfkmddadcki"); // Stacking context debugger
  }

  private static createIPCHandlers () : void {
    for(const method of ElectronFileSystem["exposed"]) {
      ipcMain.handle(method, (_event, ...args) => {
        const execution = ElectronFileSystem[method](...args);
        if (execution instanceof Promise) {
          execution.catch(err => console.error(err));
        }

        return execution;
      });
    }
  }

  static main (app : Electron.App, browserWindow : typeof BrowserWindow) : void {
    Main.BrowserWindow = browserWindow;
    Main.application = app;
    Main.application.on("window-all-closed", Main.onWindowAllClosed);
    Main.application.on("ready", Main.onReady);

    Main.application.whenReady()
      .then(() => {
        Main.loadExtensions()
          .then(() => Main.loadMainPage())
          .catch((e) => console.log(e));
      })
      .catch((e) => process.exit(e));
  }
}
