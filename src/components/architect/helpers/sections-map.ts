import type {
  BopsConfigurationEntry,
  Dependency } from "meta-system/dist/src/configuration/business-operations/business-operations-type";

export class SectionsMap {
  public outputs : Record<string, HTMLSpanElement> =  {};
  public inputs : Record<string, HTMLSpanElement> =  {};
  public connections : Record<string, string[]> = {};

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

  private connectModule (module : BopsConfigurationEntry) : void {
    for(const dependency of module.dependencies) this.addConnection(dependency, module.key);
  }

  private connectModules (modules : BopsConfigurationEntry[]) : void {
    for(const module of modules) this.connectModule(module);
  }

  private clearConnections () : void { this.connections = {}; }

  public refreshConnections (bopModules : BopsConfigurationEntry[]) : void {
    this.clearConnections();
    this.connectModules(bopModules);
  }
}


const sectionsMap = new SectionsMap();

export { sectionsMap };
