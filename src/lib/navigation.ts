import { Writable, writable } from "svelte/store";

class Navigation {
  private _pathSvelteStore = writable("");
  private _path = "";
  private _registeredPaths : Set<string> = new Set();
  private _activeSwitchPath = "";

  public get pathStore () : Writable<string> {
    return this._pathSvelteStore;
  }

  public get currentPath () : string {
    return this._path;
  }

  public get allRegisteredPaths () : string[] {
    const paths = [];

    this._registeredPaths.forEach((path) => {
      paths.push(path);
    });

    return paths;
  }

  public get activeSwitchPath () : string {
    return this._activeSwitchPath;
  }

  /** Only sets switch if it matches the current route better than the active one */
  public setWorkingSwitchPath (switchPath : string) : void {
    const currentDiff = this.getPathDiffMetric(this._activeSwitchPath, this.currentPath);
    const newDiff = this.getPathDiffMetric(switchPath, this.currentPath);

    console.log(this._activeSwitchPath, currentDiff, switchPath, newDiff, " ------- ");

    // New switchPath is a better match than current one
    if (currentDiff >= newDiff) {
      console.log("Setting new switchPath");
      this._activeSwitchPath = switchPath;
    }
  }

  public registerPath (path : string) : void {
    this._registeredPaths.add(this.normalizePath(path));
  }

  // eslint-disable-next-line max-lines-per-function
  private getMatchingRegisteredPath (path : string) : string {
    for (const registeredPath of this._registeredPaths) {
      if (this.pathsMatches(registeredPath, path)) {
        return registeredPath;
      }
    }

    return "";
  }

  public isCurrentPath (path : string, deep = false) : boolean {
    return this.pathsMatches(path, this.currentPath, deep);
  }

  private constructor (path ?: string) {
    this._pathSvelteStore = writable(path || "");
    this._path = path || "";

    this._pathSvelteStore.subscribe((navigationPath) => {
      this._path = navigationPath;

      console.log("%cNavigating pages: " + navigationPath, "color: blue");
      if (navigationPath === window.location.pathname + window.location.search) {
        return;
      }

      window.history.pushState({}, "", navigationPath);
    });

    window.onpopstate = () : void => {
      this.navigateTo(window.location.pathname + window.location.search);
    };
  }

  public navigateAppendTo (path : string) : void {
    const workingPath = path.startsWith("/") ? path.slice(1) : path;
    this._pathSvelteStore.set(this.currentPath + workingPath);
  }

  public navigateTo (path : string) : void {
    this._pathSvelteStore.set(path);
  }

  public goBack () : void {
    window.history.back();
  }

  public static getNavigator () : Navigation {
    return new Navigation(window.location.pathname + window.location.search);
  }

  /** Only works if the path was registered */
  // eslint-disable-next-line max-lines-per-function
  public getCurrentPathParams (path ?: string) : Record<string, string> {
    const currentPathSteps = this.normalizePath(this.currentPath).split("/");
    const matchingRegistered = path ? this.normalizePath(path) : this.getMatchingRegisteredPath(this.currentPath);

    if (!matchingRegistered) { return ({}); }

    const registeredPathSteps = matchingRegistered.split("/");
    const paramsIndexes : number[] = [];

    registeredPathSteps.forEach((pathPiece, index) => {
      if (pathPiece.startsWith(":")) { paramsIndexes.push(index); }
    });

    const result = {};

    paramsIndexes.forEach((index) => {
      result[registeredPathSteps[index].slice(1)] = currentPathSteps[index];
    });

    return result;
  }

  private normalizePath (path : string) : string {
    let finalPath = path;
    if (!path.endsWith("/") && path.split("/").length >= 3) {
      finalPath += "/";
    }

    return finalPath;
  }

  /** Higher number means worse confidence, and 0 is no diff */
  // eslint-disable-next-line max-lines-per-function
  private getPathDiffMetric (templatePath : string, path : string) : number {
    if (templatePath === path) { return 0; }

    const templatePathSteps = this.normalizePath(templatePath).split("/").filter((elm) => elm !== "");
    const pathSteps = this.normalizePath(path).split("/").filter((elm) => elm !== "");

    let confidence = 0;

    confidence += pathSteps.length - templatePathSteps.length;

    for (let index = 0; index <= templatePathSteps.length -1; index ++) {
      const step = templatePathSteps[index];
      const evaluatedStep = pathSteps[index];

      if (step.startsWith(":")) {
        continue;
      }

      if (step !== evaluatedStep) { confidence += 1; }
    }

    return confidence;
  }

  // eslint-disable-next-line max-lines-per-function
  public pathsMatches (templatePath : string, path : string, deep = false) : boolean {
    if (templatePath === path) { return true; }
    console.log(`%cEvaluating "${templatePath}" against path "${path}"`, "color: pink");

    const templatePathSteps = this.normalizePath(templatePath).split("/").filter((elm) => elm !== "");
    const pathSteps = this.normalizePath(path).split("/").filter((elm) => elm !== "");

    let result = false;

    if ((templatePathSteps.length !== pathSteps.length) && !deep) { return false; }

    for (let index = 0; index <= templatePathSteps.length -1; index ++) {
      const step = templatePathSteps[index];
      const evaluatedStep = pathSteps[index];

      if (step.startsWith(":")) {
        continue;
      }

      // console.log(step, evaluatedStep, step === evaluatedStep, index, templatePathSteps.length -1);
      result = step === evaluatedStep;
      if (!result) { return result;}
    }

    // console.log(templatePathSteps, pathSteps, " <<<<<<<<<<< - Equal?", result);

    return result;
  }
}

export const navigation = Navigation.getNavigator();

window["svelteNavigation"] = navigation;
