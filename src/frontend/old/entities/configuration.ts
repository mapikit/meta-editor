/* eslint-disable @typescript-eslint/no-shadow */
import { get, readable, Readable, writable, Writable } from "svelte/store";
import { EnvironmentVariable } from "./environment-variable";
import { Protocol } from "./protocol";
import { Schema, SchemaParameters } from "./schema";
import { BOpParameters, UIBusinessOperation } from "./business-operation";
import type { Serialized } from "./serialized-type";
import type { ConfigurationType } from "meta-system";

type ConfigurationParameter = {
  projectId : string;
  id : string;
  version : string;
  envs ?: Serialized<EnvironmentVariable>[];
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
  public envs : Writable<EnvironmentVariable[]> = writable([]);
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
    this.createdAt = readable(createdAt ? new Date(createdAt) : new Date());
    this.updatedAt = readable(updatedAt ? new Date(updatedAt) : new Date());

    this.envs.set((envs && envs.map((env) => new EnvironmentVariable(env))) ?? []);
    this.schemas = schemas.map(schema => schema instanceof Schema ? schema :
      new Schema(schema as SchemaParameters));
    this.businessOperations = businessOperations.map(bop => bop instanceof UIBusinessOperation ? bop :
      new UIBusinessOperation(bop as BOpParameters));
    this.protocols = protocols.map(protocol => protocol instanceof Protocol ? protocol :
      new Protocol(protocol as Serialized<Protocol, "definition">));
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
      envsCount: get(this.envs).length,
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
      envs: get(this.envs).map((x) => x.serialized()),
      protocols: this.protocols.map((x) => x.serialized()),
      schemas: this.schemas.map((x) => x.serialized()),
      createdAt: get(this.createdAt),
      updatedAt: get(this.updatedAt),
    };
  }

  public removeEnv (env : EnvironmentVariable) : void {
    this.envs.update((envs) => {
      const index = envs.findIndex((existingEnv) => existingEnv.key === env.key && existingEnv.value === env.value);

      if (index >= 0) {
        envs.splice(index, 1);
      }

      return envs;
    });
  }

  public exportable (projectName = "MyProject") : ConfigurationType {
    return {
      name: projectName,
      version: get(this.version),
      envs: get(this.envs).map(env => env.exportable()),
      schemas: this.schemas.map(schema => schema.exportable()),
      protocols: this.protocols.map(protocol => protocol.exportable()),
      businessOperations: this.businessOperations.map(bop => bop.exportable()),
    };
  }

  public getAvailableBopName (defaultNewName = "New BOp") : string {
    const currentNames = this.businessOperations.map(bop => get(bop.name));
    if(!currentNames.includes(defaultNewName)) return defaultNewName;
    let i = 2;
    while (currentNames.includes(`${defaultNewName} ${i}`)) i++;
    return `${defaultNewName} ${i}`;
  }

  public download (projectName = "MyProject") : void {
    const file = new Blob([JSON.stringify(this.exportable(projectName), null, 2)], { type: "application/JSON" });
    const filename = `${projectName}-${get(this.version).replace(/\./g, "_")}.json`;
    const url = URL.createObjectURL(file);
    const el = document.createElement("a");
    document.body.appendChild(el);
    el.setAttribute("href", url);
    el.setAttribute("download", filename);
    el.click();
    setTimeout(function () {
      document.body.removeChild(el);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
