import type { ObjectDefinition } from "@meta-system/object-definition";
import type { PropertyListEntry } from "../common/types/property-list-entry";
import { readable, Readable, Writable, writable } from "svelte/store";

type SchemaParameters = {
  id : string;
  format : ObjectDefinition;
  name : string;
  dbProtocol : string;
  description : string;
  isLocked : boolean,
  isStarred : boolean,
}

export class Schema {
  public readonly format : Writable<ObjectDefinition> = writable({});
  public readonly description : Writable<string> = writable("");
  public readonly name : Writable<string> = writable("");
  public readonly dbProtocol : Writable<string> = writable("");
  public readonly isStarred : Writable<boolean> = writable(false);
  public readonly isLocked : Writable<boolean> = writable(false);
  public readonly id : Readable<string>;

  // eslint-disable-next-line max-params
  public constructor ({ id, format, name, dbProtocol, isLocked, isStarred } : SchemaParameters) {
    this.format.set(format);
    this.name.set(name);
    this.dbProtocol.set(dbProtocol);
    this.isLocked.set(isLocked);
    this.isStarred.set(isStarred);

    this.id = readable(id);
  }

  public getSchemaCardInfo () : PropertyListEntry {
    return {
      id: this.id,
      name: this.name,
      locked: this.isLocked,
      starred: this.isStarred,
      description: this.description,
      dataValues: [
        { name: "DB Protocol", value: this.dbProtocol },
      ],
    };
  }
}
