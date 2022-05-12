import { get, readable, Readable, writable, Writable } from "svelte/store";
import type { Configuration } from "./configuration";

type ProjectContructorParameter = {
  id : string;
  name : string;
  description : string;
  configuration ?: Configuration;
  isStarred : boolean;
}

export type ConfigurationSummary = {
  version : string;
  envsCount : number;
  schemasCount : number;
  bopsCount : number;
  protocolsCount : number;
}

export class Project {
  public readonly id : Readable<string>;
  public readonly name : Writable<string> = writable("");
  public readonly description : Writable<string> = writable("");
  public readonly configuration : Writable<Configuration> = writable();
  public readonly isStarred : Writable<boolean> = writable(false);

  constructor ({ id, name, description, configuration, isStarred } : ProjectContructorParameter) {
    this.id = readable(id);
    this.name.set(name);
    this.description.set(description);
    this.configuration.set(configuration);
    this.isStarred.set(isStarred);
  }

  public getConfigurationSummary () : ConfigurationSummary {
    const configuration = get(this.configuration);
    const result = {
      version: get(configuration.version),
      envsCount: get(configuration.envs).length,
      schemasCount: get(configuration.schemas).length,
      bopsCount: get(configuration.businessOperations).length,
      protocolsCount: get(configuration.protocols).length,
    };

    return result;
  }
}
