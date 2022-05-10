import type { ObjectDefinition } from "@meta-system/object-definition";

export class Schema {
  // eslint-disable-next-line max-params
  public constructor (
    public format : ObjectDefinition,
    public name : string,
    public dbProtocol : string,
    public identifier : string,
  ) {}
}
