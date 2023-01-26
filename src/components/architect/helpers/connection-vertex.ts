import { writable, Writable } from "svelte/store";

export class ConnectionPointVertex {
  // eslint-disable-next-line max-params
  public constructor (
    public readonly propertyType : Writable<string>,
    public readonly propertyPath : Writable<string>,
    public readonly parentKey : number | "input",
    public element : HTMLElement,
  ) { }

  // eslint-disable-next-line max-params
  public static buildNew (
    propertyType : string,
    propertyPath : string,
    parentKey : number | "input",
    element : HTMLElement,
  ) : ConnectionPointVertex {
    return new ConnectionPointVertex(writable(propertyType), writable(propertyPath), parentKey, element);
  }
}
