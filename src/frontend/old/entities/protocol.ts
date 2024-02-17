import type { MetaProtocolDefinition } from "@meta-system/meta-protocol-helper";
import type { CloudedObject } from "meta-system/dist/src/common/types/clouded-object";
import { ProtocolConfigType, ProtocolKind } from "meta-system/dist/src/configuration/protocols/protocols-type";
import { nanoid } from "nanoid";
import type { PropertyListEntry } from "src/common/types/property-list-entry";
import { get, Readable, readable, Writable, writable } from "svelte/store";
import { availableConfigurations, currentConfigId } from "../stores/configuration-store";
import type { Serialized } from "./serialized-type";

export class Protocol {
  // MUST BE READONLY WHEN WE IMPLEMENT BACK END
  // Just had some workarounds to update the UI for testing purposes
  public id : Readable<string>;
  public readonly protocolName : Writable<string> = writable(""); // User defined Name
  public readonly protocol : Writable<string> = writable(""); // Protocol Name (as in npm)
  public readonly protocolVersion : Writable<string> = writable(""); // Protocol Version
  public readonly protocolKind : Writable<ProtocolKind> = writable(ProtocolKind.normal); // Protocol Kind (normal or db)
  public readonly identifier : Writable<string> = writable(""); // The string identifier (unique)
  public readonly validatedProtocolId : Writable<string> = writable(""); // Id of protocol in db
  public readonly isStarred : Writable<boolean> = writable(false); // Is protocol favorited
  public readonly isLocked : Writable<boolean> = writable(false); // Is locked (unmodifiable)
  public readonly description : Writable<string> = writable(""); // User defined description
  public readonly configuration : Writable<object> = writable({}); // User defined configuration

  private _definition : Omit<MetaProtocolDefinition, "entrypoint" | "className"> = {
    configurationFormat: {},
    description: "",
    protocolName: "",
    author: "",
    functionDefinitions: [],
    version: "",
  };

  // TODO Get definition based on the validated protocol ID
  public set definition (definition : Omit<MetaProtocolDefinition, "entrypoint" | "className">) {
    this._definition = definition;
  }

  public get definition () : Omit<MetaProtocolDefinition, "entrypoint" | "className"> {
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
    protocolKind,
    protocol,
  } : Serialized<Protocol, "definition">) {
    this.protocol.set(protocol);
    this.id = readable(id);
    this.identifier.set(identifier);
    this.validatedProtocolId.set(validatedProtocolId);
    this.protocolName.set(protocolName);
    this.protocolVersion.set(protocolVersion);
    this.isStarred.set(isStarred);
    this.isLocked.set(isLocked);
    this.description.set(description);
    this.configuration.set(configuration);
    this.protocolKind.set(protocolKind as ProtocolKind);
  }

  public static deleteProtocol (id : string) : void {
    availableConfigurations.update(configs => {
      const list = configs.find(config => get(config.id) === get(currentConfigId)).protocols;
      const itemIndex = list.findIndex((protocol) => get(protocol.id) === id);
      list.splice(itemIndex, 1);
      return configs;
    });
  }

  public async getDataFromValidatedProtocol () : Promise<void> {
    // TODO populate: definition, protocolType
  }

  // eslint-disable-next-line max-lines-per-function
  public static createNewProtocol () : Protocol {
    const newProtocol = new Protocol({
      id: nanoid(),
      validatedProtocolId: "",
      protocol: "Not Selected",
      protocolName: "New Protocol",
      identifier: nanoid(),
      protocolVersion: "0.0.1",
      isStarred: false,
      isLocked: false,
      description: "Stub Protocol Description",
      configuration: {},
      protocolKind: ProtocolKind.dbProtocol,
    });


    // protocols.update((value) => { value.push(newProtocol); return value; });
    // saveConfigurations();
    return newProtocol;
  }

  public getCardInfo () : PropertyListEntry {
    const result : PropertyListEntry = {
      type: "Protocol",
      id: get(this.id),
      name: this.protocolName,
      locked: this.isLocked,
      starred: this.isStarred,
      description: this.description,
      dataValues: [
        // Changing these needs to change the type and version of the protocol,
        // and such information comes from the validated protocol, so can't be set
        // manually from the User Interface.
        { name: "Version", value: this.protocolVersion, editable: false },
        { name: "Type", value: this.protocolKind, editable: false },
      ],
    };

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  public serialized () : Serialized<Protocol, "definition"> {
    return ({
      id: get(this.id),
      identifier: get(this.identifier),
      validatedProtocolId: get(this.validatedProtocolId),
      protocol: get(this.protocol),
      protocolName: get(this.protocolName),
      protocolVersion: get(this.protocolVersion),
      isStarred: get(this.isStarred),
      isLocked: get(this.isLocked),
      description: get(this.description),
      configuration: get(this.configuration),
      protocolKind: get(this.protocolKind),
    });
  }

  public exportable () : ProtocolConfigType {
    return ({
      protocol: get(this.protocol),
      protocolKind: get(this.protocolKind),
      protocolVersion: get(this.protocolVersion),
      identifier: get(this.identifier),
      configuration: get(this.configuration) as CloudedObject,
    });
  }
}
