import type { ObjectDefinition } from "@meta-system/object-definition";
import type { PropertyListEntry } from "../common/types/property-list-entry";
import { get, readable, Readable, Writable, writable } from "svelte/store";
import { saveConfigurations, schemas } from "../stores/configuration-store";
import { nanoid } from "nanoid";
import type { Serialized } from "./serialized-type";

export type SchemaParameters = {
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
  public constructor ({ id, format, name, dbProtocol, isLocked, isStarred, description } : SchemaParameters) {
    this.format.set(format);
    this.name.set(name);
    this.dbProtocol.set(dbProtocol);
    this.isLocked.set(isLocked);
    this.isStarred.set(isStarred);
    this.description.set(description);

    this.id = readable(id);
    this.keepStorageUpdated();
  }

  public static deleteSchema (id : string) : void {
    schemas.update((list) => {
      const itemIndex = list.findIndex((schema) => get(schema.id) === id);

      list.splice(itemIndex, 1);

      return list;
    });

    saveConfigurations();
  }

  public getCardInfo () : PropertyListEntry {
    return {
      id: get(this.id),
      name: this.name,
      locked: this.isLocked,
      starred: this.isStarred,
      description: this.description,
      dataValues: [
        { name: "DB Protocol", value: this.dbProtocol, editable: true },
      ],
    };
  }

  public static async createNewSchema () : Promise<Schema> {
    const newSchema = new Schema({
      id: nanoid(),
      format: {},
      name: "New Schema",
      dbProtocol: "<empty>",
      isStarred: false,
      isLocked: false,
      description: "New Schema Description",
    });

    return newSchema;
  }

  public serialized () : Serialized<Schema> {
    return ({
      format: get(this.format),
      description: get(this.description),
      name: get(this.name),
      dbProtocol: get(this.dbProtocol),
      isStarred: get(this.isStarred),
      isLocked: get(this.isLocked),
      id: get(this.id),
    });
  }

  public exported () : object {
    return ({
      format: get(this.format),
      name: get(this.name),
      dbProtocol: get(this.dbProtocol),
      identifier: get(this.id),
    });
  }

  private keepStorageUpdated () : void {
    this.format.subscribe(saveConfigurations);
    this.description.subscribe(saveConfigurations);
    this.name.subscribe(saveConfigurations);
    this.dbProtocol.subscribe(saveConfigurations);
    this.isStarred.subscribe(saveConfigurations);
    this.isLocked.subscribe(saveConfigurations);
    this.id.subscribe(saveConfigurations);
  }
}
