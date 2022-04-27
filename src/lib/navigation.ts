import { Writable, writable } from "svelte/store";

class Navigation {
  private pathSvelteStore = writable("");
  private path = "";
  private registeredPaths : Set<string> = new Set();

  public get pathStore () : Writable<string> {
    return this.pathSvelteStore;
  }

  public get currentPath () : string {
    return this.path;
  }

  public get allRegisteredPaths () : string[] {
    const paths = [];

    this.registeredPaths.forEach((path) => {
      paths.push(path);
    });

    return paths;
  }

  public registerPath (path : string) : void {
    console.log("registering path: ", this.normalizePath(path));
    this.registeredPaths.add(this.normalizePath(path));
  }

  // eslint-disable-next-line max-lines-per-function
  private getMatchingRegisteredPath (path : string) : string {
    for (const registeredPath of this.registeredPaths) {
      if (this.pathsMatches(registeredPath, path)) {
        return registeredPath;
      }
    }

    return "";
  }

  public isCurrentPath (path : string) : boolean {
    return this.pathsMatches(this.currentPath, path);
  }

  private constructor (path ?: string) {
    this.pathSvelteStore = writable(path || "");
    this.path = path || "";

    this.pathSvelteStore.subscribe((navigationPath) => {
      this.path = navigationPath;

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

  public navigateTo (path : string) : void {
    this.pathSvelteStore.set(path);
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

  private pathsMatches (templatePath : string, path : string) : boolean {
    const templatePathSteps = this.normalizePath(templatePath).split("/");
    const pathSteps = this.normalizePath(path).split("/");

    let result = false;

    if (templatePathSteps.length !== pathSteps.length) { return false; }

    for (let index = 0; index <= templatePathSteps.length -1; index ++) {
      const step = templatePathSteps[index];
      const evaluatedStep = pathSteps[index];

      if (step.startsWith(":")) {
        continue;
      }

      result = step === evaluatedStep;
    }

    return result;
  }
}

export const navigation = Navigation.getNavigator();

window["svelteNavigation"] = navigation;
