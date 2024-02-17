import type { CoordinateInfo } from "../../../common/types/geometry";
import { get, writable, Writable } from "svelte/store";
import type { ObjectDefinition } from "@meta-system/object-definition";

export type VertexType = "functionalOrigin" | "functionalTarget" | "output" | "input" | "module"

export class ConnectionPointVertex {
  // eslint-disable-next-line max-params
  public constructor (
    public readonly propertyType : Writable<string>,
    public readonly propertyPath : Writable<string>,
    public readonly parentKey : number | "input",
    public readonly type : VertexType,
    public element : HTMLElement,
  ) {
    if (parentKey === undefined) { throw Error("Cannot create Connection Point without parentKey"); }
  }

  // eslint-disable-next-line max-params
  public static buildNew (
    propertyType : string,
    propertyPath : string,
    parentKey : number | "input",
    type : VertexType,
    element ?: HTMLElement,
  ) : ConnectionPointVertex {
    return new ConnectionPointVertex(writable(propertyType), writable(propertyPath), parentKey, type, element);
  }

  public get coordinates () : CoordinateInfo {
    if (!this.element) { return { x: undefined, y: undefined }; }

    const rectElement = this.element.getBoundingClientRect();
    return {
      x: rectElement.x + rectElement.width/2,
      y: rectElement.y + rectElement.height/2,
    };
  }

  public get isDrawable () : boolean {
    return this.element !== undefined && this.element !== null;
  }

  public get id () : string {
    return ConnectionPointVertex.generateId(this.type, this.parentKey, get(this.propertyPath));
  }

  public static generateId (type : VertexType, parentKey : number | "input", path : string) : string {
    // for the root as the parent (modular or functional deps)
    if (path === "" || path === undefined) {
      return `${type}.${parentKey}`;
    }

    return `${type}.${parentKey}.${path}`;
  }

  /** Corrects a path based on the presence of arrays in it */
  // eslint-disable-next-line max-lines-per-function
  public static solvePropertyPath (definition : ObjectDefinition, path : string[]) : string {
    let resultPath = "";

    const partialDefinition = definition;
    let isInArray = false;
    let tempData = partialDefinition;
    for (const step of path) {
      if (tempData[step]["type"] === "array") {
        resultPath += `.${step}`;
        tempData = tempData[step]["data"];
        isInArray = true;
        continue;
      }

      resultPath += isInArray ? `[${step}]` : `.${step}`;
      isInArray = false;
      tempData = tempData[step]["subtype"];
    }

    return resultPath.charAt(0) === "." ? resultPath.substring(1) : resultPath;
  }
}
