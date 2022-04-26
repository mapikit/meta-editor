class Navigation {
  private currentPath = "";

  public get path () : string {
    return this.currentPath;
  }

  public constructor (path ?: string) {
    this.currentPath = path || "";
  }

  public navigateTo (path : string) : void {
    this.currentPath = path;
  }

}

export const navigation = new Navigation();
