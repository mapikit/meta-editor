import type { CoordinateInfo } from "../../../common/types/geometry";
import { get, writable, Writable } from "svelte/store";

export type VertexType = "functionalOrigin" | "functionalTarget" | "output" | "input" | "module"

export class ConnectionPointVertex {
  // eslint-disable-next-line max-params
  public constructor (
    public readonly propertyType : Writable<string>,
    public readonly propertyPath : Writable<string>,
    public readonly parentKey : number | "input",
    public readonly type : VertexType,
    public element : HTMLElement,
  ) { }

  // eslint-disable-next-line max-params
  public static buildNew (
    propertyType : string,
    propertyPath : string,
    parentKey : number | "input",
    type : VertexType,
    element : HTMLElement,
  ) : ConnectionPointVertex {
    return new ConnectionPointVertex(writable(propertyType), writable(propertyPath), parentKey, type,element);
  }

  public get coordinates () : CoordinateInfo {
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

  // The functional origin is just the moduleKey, but the functional target is under the list;
  public static generateId (type : VertexType, parentKey : number | "input", path : string) : string {
    const usedPath = type === "functionalOrigin" ? "" : `.${path}`;

    return `${type}.${parentKey}${usedPath}`;
  }
}
