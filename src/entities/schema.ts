import type { ObjectDefinition } from "@meta-system/object-definition";

export class Schema {
  // eslint-disable-next-line max-params
  public constructor (
    public readonly format : ObjectDefinition,
    public readonly name : string,
    public readonly dbProtocol : string,
    public readonly identifier : string,
  ) {}
}
