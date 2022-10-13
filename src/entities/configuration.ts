/* eslint-disable @typescript-eslint/no-shadow */
import { get, readable, Readable, writable, Writable } from "svelte/store";
import type { EnvironmentVariable } from "./environment-variable";
import { Protocol, ProtocolParameters } from "./protocol";
import { Schema, SchemaParameters } from "./schema";
import { BOpParameters, UIBusinessOperation } from "./business-operation";
import { saveConfigurations } from "../stores/configuration-store";
import type { Serialized } from "./serialized-type";

type ConfigurationParameter = {
  projectId : string;
  id : string;
  version : string;
  envs ?: EnvironmentVariable[];
  protocols ?: Protocol[];
  schemas ?: Schema[];
  businessOperations ?: UIBusinessOperation[];
  updatedAt : Date;
  createdAt : Date;
}

export type ConfigurationSummary = {
  version : string;
  envsCount : number;
  schemasCount : number;
  bopsCount : number;
  protocolsCount : number;
}

type SerializedConfiguration =
  { protocols : Array<Serialized<Protocol, "definition">> } & Serialized<Configuration, "protocols">;

export class Configuration {
  public readonly projectId : Readable<string>;
  public readonly id : Readable<string>;
  public readonly version : Writable<string> = writable("0.0.0");
  public readonly updatedAt : Readable<Date>;
  public readonly createdAt : Readable<Date>;

  // These properties are not stores because they're not meant to be
  // changed in here, they should be changed only when this is the current
  // configuration selected. In such case, they will be in the `configuration-store.ts` file, not here
  public businessOperations : UIBusinessOperation[] = [];
  public envs : EnvironmentVariable[] = [];
  public protocols : Protocol[] = [];
  public schemas : Schema[] = [];

  // eslint-disable-next-line max-lines-per-function
  public constructor ({
    projectId,
    id,
    version,
    envs = [],
    schemas = [],
    businessOperations = [],
    protocols = [],
    updatedAt,
    createdAt,
  } : ConfigurationParameter) {
    this.projectId = readable(projectId);
    this.id = readable(id);
    this.version.set(version);
    this.createdAt = readable(createdAt);
    this.updatedAt = readable(updatedAt);

    this.envs = envs;
    this.schemas = schemas.map(schema => schema instanceof Schema ? schema :
      new Schema(schema as SchemaParameters));
    this.businessOperations = businessOperations.map(bop => bop instanceof UIBusinessOperation ? bop :
      new UIBusinessOperation(bop as BOpParameters));
    this.protocols = protocols.map(protocol => protocol instanceof Protocol ? protocol :
      new Protocol(protocol as ProtocolParameters));
  }

  public static getNullable () : Configuration {
    return new Configuration({
      projectId: "",
      id: "",
      version: "",
      createdAt: new Date(0),
      updatedAt: new Date(0),
    });
  }

  /** Loads configuration content into the store */
  public async loadContents () : Promise<void> {
    // TODO: Implement get from BackEnd
  }

  public getConfigurationSummary () : ConfigurationSummary {
    return {
      version: get(this.version),
      envsCount: this.envs.length,
      bopsCount: this.businessOperations.length,
      schemasCount: this.schemas.length,
      protocolsCount: this.protocols.length,
    };
  }

  public serialized () : SerializedConfiguration {
    return {
      projectId: get(this.projectId),
      id: get(this.id),
      version: get(this.version),
      businessOperations: this.businessOperations.map((x) => x.serialized()),
      envs: this.envs.map((x) => x.serialized()),
      protocols: this.protocols.map((x) => x.serialized()),
      schemas: this.schemas.map((x) => x.serialized()),
      createdAt: get(this.createdAt),
      updatedAt: get(this.updatedAt),
    };
  }

  public keepStorageUpdated () : void {
    this.projectId.subscribe(saveConfigurations);
    this.id.subscribe(saveConfigurations);
    this.version.subscribe(saveConfigurations);
  }
}
