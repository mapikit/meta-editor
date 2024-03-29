import type { Schema } from "../entities/schema";
import { derived, get, Readable, Writable, writable } from "svelte/store";
import type { UIBusinessOperation } from "../entities/business-operation";
import type { Protocol } from "../entities/protocol";
import { Configuration } from "../entities/configuration";
import { availableProjects } from "./projects-store";
import { selectedSystem } from "../components/systems-sidebar/systems-stores";
import { getSetFunction, SetterType } from "./custom-derived";

export const availableConfigurations : Writable<Configuration[]> = writable([]);

// From this and below, it should actually be the data of the currently selected configuration.
// If no configuration is selected, this should be empty.
export const currentConfigId : Writable<string> = writable("");

export const currentConfig = derived([currentConfigId, selectedSystem, availableConfigurations], ([id,,configs]) => {
  return configs.find(config =>
    get(config.id) === id && get(config.projectId) === get(selectedSystem),
  ) ?? Configuration.getNullable();
});

export const projectVersions = derived(
  [selectedSystem, availableConfigurations, availableProjects], ([system, configs]) => {
    return configs.filter((config) => get(config.projectId) === system);
  });

export const schemas = derived(currentConfig, config => config.schemas);
export const businessOperations = derived(currentConfig, config => config.businessOperations);
export const protocols = derived(currentConfig, config => config.protocols);
export const environmentVariables = derived(currentConfig, config => config.envs);


export type CustomDerived<T> = Readable<T> & SetterType<T>

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getSchemaById = (id : string) : CustomDerived<Schema> => {
  return {
    ...derived(schemas, $schemas => $schemas.find((schema) => get(schema.id) === id)),
    set: getSetFunction("schemas", id),
  };
};

export const getProtocolById = (id : string) : CustomDerived<Protocol> => {
  return {
    ...derived(protocols, $protocols => $protocols.find((protocol) => get(protocol.id) === id)),
    set: getSetFunction("protocols", id),
  };
};

export const getBopById = (id : string) : CustomDerived<UIBusinessOperation> => {
  return {
    ...derived(businessOperations, $bops => $bops.find((bop) => get(bop.id) === id)),
    set: getSetFunction("businessOperations", id),
  };
};

export const getConfigurationById = (id : string) : Configuration => {
  return get(availableConfigurations).find((element) => get(element.id) === id);
};
