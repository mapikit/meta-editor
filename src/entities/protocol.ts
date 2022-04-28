import type { ObjectDefinition } from "@meta-system/object-definition";
import type { ProtocolKind } from "meta-system/dist/src/configuration/protocols/protocols-type";

export class Protocol {
  public protocolConfig : object = {};
  private _definition : ObjectDefinition = {};

  public set definition (defintion : ObjectDefinition) {
    this._definition = defintion;
  }

  public get definition () : ObjectDefinition {
    return this._definition;
  }

  // eslint-disable-next-line max-params
  public constructor (
    public readonly protocolName : string,
    public readonly protocolVersion : string,
    public readonly protocolType : ProtocolKind,
  ) {}

  // In the future we can implement a fetch function to get their definition and other infos
  // on the back end, while also using svelte stores to do it (it is really cool)
}
