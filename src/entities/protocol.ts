import type { ObjectDefinition } from "@meta-system/object-definition";
import { ProtocolKind } from "meta-system/dist/src/configuration/protocols/protocols-type";
import type { PropertyListEntry } from "src/common/types/property-list-entry";
import { get, Readable, readable, Writable, writable } from "svelte/store";
import { protocols, saveConfigurations } from "../stores/configuration-store";

type ProtocolParameters = {
  id : string;
  identifier : string;
  validatedProtocolId : string;
  protocolName : string;
  protocolVersion : string;
  isStarred : boolean;
  isLocked : boolean;
  description : string;
  configuration : object;
}

export class Protocol {
  // MUST BE READONLY WHEN WE IMPLEMENT BACK END
  // Just had some workarounds to update the UI for testing purposes
  public id : Readable<string>;
  public readonly protocolName : Writable<string> = writable("");
  public readonly protocolVersion : Writable<string> = writable("");
  public readonly protocolType : Writable<ProtocolKind> = writable(ProtocolKind.normal);
  public readonly identifier : Writable<string> = writable("");
  public readonly validatedProtocolId : Writable<string> = writable("");
  public readonly protocolConfig : Writable<object> = writable({});
  public readonly isStarred : Writable<boolean> = writable(false);
  public readonly isLocked : Writable<boolean> = writable(false);
  public readonly description : Writable<string> = writable("");
  public readonly configuration : Writable<object> = writable({});

  private _definition : ObjectDefinition = {};

  // TODO Get definition based on the validated protocol ID
  public set definition (definition : ObjectDefinition) {
    this._definition = definition;
  }

  public get definition () : ObjectDefinition {
    return this._definition;
  }

  // eslint-disable-next-line max-lines-per-function
  public constructor ({
    id,
    identifier,
    validatedProtocolId,
    protocolName,
    protocolVersion,
    isStarred,
    isLocked,
    description,
    configuration,
  } : ProtocolParameters) {
    this.id = readable(id);
    this.identifier.set(identifier);
    this.validatedProtocolId.set(validatedProtocolId);
    this.protocolName.set(protocolName);
    this.protocolVersion.set(protocolVersion);
    this.isStarred.set(isStarred);
    this.isLocked.set(isLocked);
    this.description.set(description);
    this.configuration.set(configuration);

    this.keepStorageUpdated();
  }

  public async getDataFromValidatedProtocol () : Promise<void> {
    // TODO populate: definition, protocolType
  }

  // eslint-disable-next-line max-lines-per-function
  public static async createNewProtocol () : Promise<void> {
    // TODO: Creates a new Protocol in the Db

    const newProtocol = new Protocol({
      id: Math.floor(Math.random() * 10000000).toString(),
      validatedProtocolId: "---",
      protocolName: "New Schema",
      identifier: "<empty>",
      protocolVersion: "0.0.1",
      isStarred: false,
      isLocked: false,
      description: "Stub Protocol Description",
      configuration: {},
    });

    newProtocol.protocolType.set(ProtocolKind.normal);

    // adds it to the store
    protocols.update((value) => { value.push(newProtocol); return value; });
    saveConfigurations();
  }

  public getProtocolCardInfo () : PropertyListEntry {
    const result : PropertyListEntry = {
      id: this.id,
      name: this.identifier,
      locked: this.isLocked,
      starred: this.isStarred,
      description: this.description,
      dataValues: [
        // Changing these needs to change the type and version of the protocol,
        // and such information comes from the validated protocol, so can't be set
        // manually from the User Interface.
        { name: "Version", value: this.protocolVersion, editable: false },
        { name: "Type", value: this.protocolType, editable: false },
      ],
    };

    return result;
  }

  public serialized () : object {
    return ({
      id: get(this.id),
      identifier: get(this.identifier),
      validatedProtocolId: get(this.validatedProtocolId),
      protocolName: get(this.protocolName),
      protocolVersion: get(this.protocolVersion),
      isStarred: get(this.isStarred),
      isLocked: get(this.isLocked),
      description: get(this.description),
      configuration: get(this.configuration),
    });
  }

  private keepStorageUpdated () : void {
    this.id.subscribe(saveConfigurations);
    this.identifier.subscribe(saveConfigurations);
    this.validatedProtocolId.subscribe(saveConfigurations);
    this.protocolName.subscribe(saveConfigurations);
    this.protocolVersion.subscribe(saveConfigurations);
    this.isStarred.subscribe(saveConfigurations);
    this.isLocked.subscribe(saveConfigurations);
    this.description.subscribe(saveConfigurations);
    this.configuration.subscribe(saveConfigurations);
  }
}
