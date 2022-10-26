import { Schema } from "../entities/schema";
import { derived, get, Readable, Writable, writable } from "svelte/store";
import { UIBusinessOperation } from "../entities/business-operation";
import { Protocol } from "../entities/protocol";
import { EnvironmentVariable } from "../entities/environment-variable";
import { localStorageService } from "../services/local-storage-service";
import { Configuration } from "../entities/configuration";
import { currentProject } from "./projects-store";

export const availableConfigurations : Writable<Configuration[]> = writable([]);

export const saveConfigurations = () : void => {
  const configs = get(availableConfigurations);
  const savingData = configs.map((config) => config.serialized());

  localStorageService.save("configurations", savingData);

  schemas.set(get(schemas));
  protocols.set(get(protocols));
  businessOperations.set(get(businessOperations));
};

// eslint-disable-next-line max-lines-per-function
export const loadConfigurationsFromStore = () : void => {
  if (localStorageService.isInStorage("configurations")) {
    const configurationsData = localStorageService.fetchKey("configurations") as object[];
    const rawConfigs : Configuration[] = [];

    configurationsData.forEach((value) => {
      const businessOperations = (value["businessOperations"] as any[]).map((bop) => new UIBusinessOperation(bop));
      const envs = (value["envs"] as any[]).map((env) => new EnvironmentVariable(env));
      const protocols = (value["protocols"] as any[]).map((protocol) => new Protocol(protocol));
      const schemas = (value["schemas"] as any[]).map((schema) => new Schema(schema));

      rawConfigs.push(new Configuration({ ...value, businessOperations, envs, protocols, schemas } as any));
    });

    availableConfigurations.set(rawConfigs);
  };

  setCurrentConfigData(get(currentProject).getConfiguration());

  // availableConfigurations.subscribe(saveConfigurations);
  startConfigurationStoreSync();
};

const setCurrentConfigData = (configuration : Configuration) : void => {
  schemas.set(configuration.schemas);
  businessOperations.set(configuration.businessOperations);
  protocols.set(configuration.protocols);
  environmentVariables.set(configuration.envs);
};

export const startConfigurationStoreSync = () : void => {
  currentProject.subscribe((project) => {
    const currentConfig = project.getConfiguration();
    setCurrentConfigData(currentConfig);
  });
};

// From this and below, it should actually be the data of the currently selected configuration.
// If no configuration is selected, this should be empty.
export const schemas : Writable<Schema[]> = writable([]);
export const businessOperations : Writable<UIBusinessOperation[]> = writable([]);
export const protocols : Writable<Protocol[]> = writable([]);
export const environmentVariables : Writable<EnvironmentVariable[]> = writable([]);

export const getSchemaById = (id : string) : Readable<Schema> => {
  return derived(currentProject, (project) => {
    const result : Schema = project.getConfiguration().schemas.find((value) => get(value.id) === id);
    return result;
  });
};

// TEMPORARY, this will likely be moved later
export const setSchema = (updatedSchema : Schema) : void => {
  schemas.update(_schemas => {
    return _schemas.map(schema => get(schema.id) === get(updatedSchema.id) ? updatedSchema : schema);
  });
};

export const getProtocolById = (id : string) : Readable<Protocol> => {
  return derived(protocols, () => {
    const result : Protocol = get(protocols).find((value) => get(value.id) === id);

    return result;
  });
};

export const getBopById = (id : string) : Readable<UIBusinessOperation> => {
  return derived(businessOperations, () => {
    const result : UIBusinessOperation = get(businessOperations).find((value) => get(value.id) === id);

    return result;
  });
};

export const getCurrentMsysConfiguration = () : object => {
  const project = get(currentProject);
  const config = project.getConfiguration();

  const result = {
    "name": get(project.name),
    "version": "1.0.0",
    "envs": config.envs.map((env) => env.serialized()),
    "protocols": config.protocols.map((protocol) => protocol.exported()),
    "schemas": config.schemas.map((schema) => schema.exported()),
    "businessOperations": config.businessOperations.map((bop) => bop.exported()),
  };

  return result;
};

export const getConfigurationById = (id : string) : Configuration => {
  return get(availableConfigurations).find((element) => get(element.id) === id);
};
