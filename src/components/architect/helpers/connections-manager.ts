import type { Dependency } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { get } from "svelte/store";
import type { ModuleCard } from "../../../common/types/module-card";
import { ConnectionPointVertex, VertexType } from "./connection-vertex";
import { DrawableConnection, ModuleConnection } from "./module-connection";

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
    return this.connections
      .filter((connection) => connection.canBeDrawn)
      .map((connection) => connection.getDrawable());
  }

  /** Evaluates if a connection is possible, and if it is not, it returns the next best connection */
  // eslint-disable-next-line max-lines-per-function
  private solveDeepConnections (connection : ModuleConnection) : DrawableConnection {
    if (connection.canBeDrawn) { return connection.getDrawable(); }

    const origin = connection.connectionOrigin.isDrawable ?
      undefined : this.findBestMatchingVertex(connection.originId);
    const target = connection.connectionOrigin.isDrawable ?
      undefined : this.findBestMatchingVertex(connection.targetId);

    return connection.getDrawable(origin, target);
  }

  // TODO account for arrays as well
  // TODO take into consideration the type of the vertex as well for smarter guesses
  private findBestMatchingVertex (vertexId : string) : ConnectionPointVertex {
    const vertexPathSteps = vertexId.split(".");
    while(this.isNill(this.vertices.get(vertexPathSteps.join("."))?.element) && vertexPathSteps.length > 0) {
      vertexPathSteps.pop();
    }

    if (vertexPathSteps.length === 0) { return undefined; }

    return this.vertices.get(vertexPathSteps.join("."));
  }

  private removeDuplicates (outputId : string) : void {
    for(const input of this.connections[outputId]) {
      while(this.connections[outputId].filter(inputId => inputId === input).length > 1) {
        const inputIndex = this.connections[outputId].indexOf(input);
        this.connections[outputId].splice(inputIndex, 1);
      }
    }
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

    console.log(this.getVisibleConnections());
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

    // console.log(`new connection from ${originId} to ${targetId}`);

    return new ModuleConnection(origin, target, connectionMode);
  }

  private preCreateVertex (type : VertexType, parentKey : "input" | number, path : string) : ConnectionPointVertex {
    const result = ConnectionPointVertex.buildNew("string", path, parentKey, type);
    this.registerVertex(result);
    return result;
  }


  private getDependencytype (dependency : Dependency) : ModuleConnection["mode"] {
    if (!dependency.originPath && !dependency.targetPath) return "functional";
    if (dependency.originPath.startsWith("module.")) return "module";
    return "normal";
  }

  private normalizePathFromDependency (path : string, connectionMode : ModuleConnection["mode"]) : string {
    if (connectionMode === "module" && path.startsWith("module.")) { return path.substring(7); }
    if (connectionMode === "normal" && path.startsWith("result.")) { return path.substring(7); }

    return path;
  }
}


const connectionsManager = new ConnectionsManager();

export { connectionsManager };
