import type { UIBusinessOperation } from "./business-operation";
import type { Schema } from "./schema";
import type { Protocol } from "./protocol";
import type { EnvironmentVariable } from "./environment-variable";
import { get, readable, Readable, writable, Writable } from "svelte/store";
import type { PropertyListEntry } from "../common/types/property-list-entry";

type ConfigurationParameter = {
  id : string;
  version : string;
  envs ?: EnvironmentVariable[];
  protocols ?: Protocol[];
  schemas ?: Schema[];
  businessOperations ?: UIBusinessOperation[];
}

export class Configuration {
  public readonly businessOperations : Writable<UIBusinessOperation[]> = writable([]);
  public readonly schemas : Writable<Schema[]> = writable([]);
  public readonly protocols : Writable<Protocol[]> = writable([]);
  public readonly envs : Writable<EnvironmentVariable[]> = writable([]);
  public readonly id : Readable<string>;
  public readonly version : Writable<string> = writable("0.0.0");

  // eslint-disable-next-line max-lines-per-function
  public constructor ({
    id,
    version,
    envs = [],
    protocols = [],
    schemas = [],
    businessOperations = [],
  } : ConfigurationParameter) {
    this.id = readable(id);
    this.version.set(version);
    this.envs.set(envs);
    this.protocols.set(protocols);
    this.schemas.set(schemas);
    this.businessOperations.set(businessOperations);
  }

  public getSchemasPropertyListEntries () : PropertyListEntry[] {
    const result = [];

    get(this.schemas).forEach((schema) => {
      result.push(schema.getSchemaCardInfo());
    });

    return result;
  }
}
