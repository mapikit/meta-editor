import type { Dependency } from "meta-system/dist/src/configuration/business-operations/business-operations-type";

export class SectionsMap {
  public outputs : Record<string, HTMLSpanElement> =  {};
  public inputs : Record<string, HTMLSpanElement> =  {};
  public connections : Record<string, string[]> = {};

  // TODO Improve the identifier to a more comprehensive and inclusive model

  public static getIdentifier (key : string | number, path : string) : string {
    return `${key}.${path}`;
  }

  public addConnection (newDependency : Dependency, targetKey : number | "input") : void {
    const outputPath = newDependency.origin === "input" ?
      `result.${newDependency.originPath}` :
      newDependency.originPath;
    const outputId = SectionsMap.getIdentifier(newDependency.origin, outputPath);
    const targetId = SectionsMap.getIdentifier(targetKey, newDependency.targetPath);
    if(this.connections[outputId] === undefined) this.connections[outputId] = [];
    this.connections[outputId].push(targetId);
  }

  public removeConnection (inputIdentifier : string) : void {
    for(const outputId of Object.keys(this.connections)) {
      const connectionIndex = this.connections[outputId].indexOf(inputIdentifier);
      if (connectionIndex !== -1) {
        this.connections[outputId].splice(connectionIndex, 1);
        return;
      }
    }
  }
}


const sectionsMap = new SectionsMap();

export { sectionsMap };
