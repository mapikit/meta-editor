/* eslint-disable @typescript-eslint/no-shadow */
import { get, readable, Readable, writable, Writable } from "svelte/store";
import type { EnvironmentVariable } from "./environment-variable";
import type { Protocol } from "./protocol";
import type { Schema } from "./schema";
import type { UIBusinessOperation } from "./business-operation";

type ConfigurationParameter = {
  projectId : string;
  id : string;
  version : string;
  envs ?: EnvironmentVariable[];
  protocols ?: Protocol[];
  schemas ?: Schema[];
  businessOperations ?: UIBusinessOperation[];
}

export type ConfigurationSummary = {
  version : string;
  envsCount : number;
  schemasCount : number;
  bopsCount : number;
  protocolsCount : number;
}

export class Configuration {
  public readonly projectId : Readable<string>;
  public readonly id : Readable<string>;
  public readonly version : Writable<string> = writable("0.0.0");

  // These properties are not stores because they're not meant to be
  // changed in here, they should be changed only when this is the current
  // configuration selected. In such case, they will be in the `configuration-store.ts` file, not here
  private readonly businessOperations : UIBusinessOperation[] = [];
  private readonly envs : EnvironmentVariable[] = [];
  private readonly protocols : Protocol[] = [];
  private readonly schemas : Schema[] = [];

  // eslint-disable-next-line max-lines-per-function
  public constructor ({
    projectId,
    id,
    version,
    envs = [],
    schemas = [],
    businessOperations = [],
    protocols = [],
  } : ConfigurationParameter) {
    this.projectId = readable(projectId);
    this.id = readable(id);
    this.version.set(version);

    this.envs = envs;
    this.schemas = schemas;
    this.businessOperations = businessOperations;
    this.protocols = protocols;
  }

  public static getNullable () : Configuration {
    return new Configuration({
      projectId: "",
      id: "",
      version: "",
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
}
