import type { Dependency } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { get } from "svelte/store";
import type { ModuleCard } from "../../../common/types/module-card";
import { ConnectionPointVertex, VertexType } from "./connection-vertex";
import { getDeepStoreObject } from "./get-deep-store-obj";
import { DrawableConnection, ModuleConnection } from "./module-connection";
import { PathUtils } from "./path-utils";

// NEXT Refactor Tasks:
// -> Stores all the vertices
// -> When connectionPoint is mounted either create a vertex or get existing
// -> Stores all the connections
// -> Has a method to get the connections to be drawn in the screen
// -----> Changes connection's stroke color if the optimal vertex is not
//        available for connection (is under a collapsed parent)
// -----> Changes connection's stroke thickness if it is a duplicate connection
//        caused by collapsed children
// -> Has a method to build the connections based off of the BopModules (refreshConnections)
/**  */
export class ConnectionsManager {
  private readonly vertices = new Map<string, ConnectionPointVertex>();
  private connections : ModuleConnection[] = [];

  /** gets an existing vertex - If returns undefined, please register it using `.registerVertex()` */
  public getVertex (id : string) : ConnectionPointVertex | undefined {
    return this.vertices.get(id);
  }

  public registerVertex (connectionPoint : ConnectionPointVertex) : void {
    this.vertices.set(connectionPoint.id, connectionPoint);
  }

  /** removes all modules that belongs to a module */
  public unregisterVerticesFromModule (moduleKey : number | "input") : void {
    const verticesToBeDeleted = [];

    this.vertices.forEach((connectionPoint, id) => {
      // moduleKey is the id ==== is a functionalOrigin vertex
      if (id === moduleKey) { verticesToBeDeleted.push(id); return; }
      if (
        id.startsWith(`${connectionPoint.type}.${moduleKey}[`)
        || id.startsWith(`${connectionPoint.type}.${moduleKey}.`)
      ) {
        verticesToBeDeleted.push(id);
        return;
      }
    });

    verticesToBeDeleted.forEach((verticesId) => { this.vertices.delete(verticesId); });
  }

  private isNill (value : unknown) : boolean { return value === undefined || value === null; }

  /** Gets connections to be drawn on the screen */
  public getVisibleConnections () : DrawableConnection[] {
    return this.getFilteredConnections()
      .map((connection) => connection.getDrawable());
  }

  private findBestMatchingVertex (vertexId : string) : ConnectionPointVertex {
    const vertexPathSteps = PathUtils.getSteps(vertexId);
    while(this.isNill(this.vertices.get(vertexPathSteps.join(""))?.element) && vertexPathSteps.length > 0) {
      vertexPathSteps.pop();
    }

    if (vertexPathSteps.length === 0) { return undefined; }

    return this.vertices.get(vertexPathSteps.join(""));
  }

  public getFilteredConnections () : ModuleConnection[] {
    return this.filterDuplicates(this.connections).filter((connection) => {
      return connection.canBeDrawn;
    });
  };

  // eslint-disable-next-line max-lines-per-function
  private filterDuplicates (connections : ModuleConnection[]) : ModuleConnection[] {
    const processed = [];
    const foundDuplicates = [];

    connections.forEach((connection) => {
      if (foundDuplicates.includes(connection)) { return; }

      const otherConnections = connections.filter(el => el !== connection);
      otherConnections.forEach((otherConnection) => {
        const hasSameOrigin = connection.connectionOrigin.id === otherConnection.connectionOrigin.id;
        const hasSameTarget = connection.connectionTarget.id === otherConnection.connectionTarget.id;
        if (hasSameOrigin && hasSameTarget) {
          foundDuplicates.push(otherConnection);
          connection.setDuplicate();
        }
      });

      processed.push(connection);
    });

    return processed;
  }

  // eslint-disable-next-line max-lines-per-function
  public refreshConnections (bopModules : ModuleCard[]) : void {
    this.connections = [];

    bopModules.forEach((module) => {
      const validDependencies = get(module.dependencies).filter((dependency) => {
        return !["constants", "constant", "variables", "variable"]
          .includes(dependency.origin.toString());
      });

      validDependencies.forEach((dependency) => {
        const connection = this.buildConnectionFromDependency(
          dependency, module.key === -1 ? "input" : module.key);

        this.connections.push(connection);
      });
    });
  }

  // eslint-disable-next-line max-lines-per-function
  private buildConnectionFromDependency (dependency : Dependency, targetmoduleIndex : "input" | number)
    : ModuleConnection {
    const connectionMode : ModuleConnection["mode"] = this.getDependencytype(dependency);
    const originVertexType : VertexType = connectionMode === "functional"
      ? "functionalOrigin" : connectionMode === "module"
        ? "module" : "output";

    const originId = ConnectionPointVertex.generateId(
      originVertexType,
      dependency.origin as ("input" | number),
      this.normalizePathFromDependency(dependency.originPath, connectionMode),
    );

    let origin = this.findBestMatchingVertex(originId);

    if (!origin) {
      origin = this.preCreateVertex(originVertexType, dependency.origin as ("input" | number), originId);
    }

    const targetVertexType : VertexType = connectionMode === "functional"
      ? "functionalTarget" : "input";

    const targetId = ConnectionPointVertex.generateId(
      targetVertexType,
      targetmoduleIndex,
      dependency.targetPath,
    );
    let target = this.findBestMatchingVertex(targetId);

    if (!target) {
      target = this.preCreateVertex(targetVertexType, targetmoduleIndex, targetId);
    }

    const result = new ModuleConnection(origin, target, connectionMode);
    result.setOptimalConnectionIds(originId,targetId);
    return result;
  }

  private preCreateVertex (type : VertexType, parentKey : "input" | number, path : string) : ConnectionPointVertex {
    const result = ConnectionPointVertex.buildNew("string", path, parentKey, type);
    this.registerVertex(result);
    return result;
  }


  private getDependencytype (dependency : Dependency) : ModuleConnection["mode"] {
    if (!dependency.originPath && !dependency.targetPath) return "functional";
    if (dependency.originPath.startsWith("module.") || dependency.originPath === "module") return "module";
    return "normal";
  }

  private normalizePathFromDependency (path : string, connectionMode : ModuleConnection["mode"]) : string {
    if (connectionMode === "module" && path.startsWith("module.") || path === "module") { return path.substring(7); }
    if (connectionMode === "normal" && path.startsWith("result.")) { return path.substring(7); }

    return path;
  }
}


const connectionsManager = new ConnectionsManager();

export { connectionsManager };
