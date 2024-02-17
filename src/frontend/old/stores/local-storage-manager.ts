import type { UIBusinessOperation } from "../entities/business-operation";
import type { Configuration } from "../entities/configuration";
import type { Project } from "../entities/project";
import type { Protocol } from "../entities/protocol";
import type { Schema } from "../entities/schema";
import type { StorageManagerType } from "./storage-manager";

// TODO Implement local storage manager

export class LocalStorageManager implements StorageManagerType {
  loginUser : (email : string, password : string) => Promise<void>;
  refreshUserAuth : () => Promise<void>;
  loadProjectsToStores : () => Promise<void>;
  loadVersionsToStores : (projectId : string) => Promise<void>;
  updateProject : (projects : Project) => Promise<void>;
  updateVersion : (version : Configuration) => Promise<void>;
  updateSchema : (versionId : string, schema : Schema) => Promise<void>;
  updateBop : (versionId : string, bop : UIBusinessOperation) => Promise<void>;
  updateProtocol : (versionId : string, protocol : Protocol) => Promise<void>;
  createProject : (project : Project) => Promise<void>;
  createVersion : (projectId : string) => Promise<void>;
  createSchema : (versionId : string) => Promise<void>;
  createBop : (versionId : string) => Promise<void>;
  createProtocol : (versionId : string) => Promise<void>;
  deleteProject : (projectId : string) => Promise<void>;
  deleteVersion : (versionId : string) => Promise<void>;
  deleteSchema : (versionId : string, schemaId : string) => Promise<void>;
  deleteBop : (versionId : string, bopId : string) => Promise<void>;
  deleteProtocol : (versionId : string, protocolId : string) => Promise<void>;
}

// export const saveConfigurations = () : void => {
//   const configs = get(availableConfigurations);
//   const savingData = configs.map((config) => config.serialized());

//   localStorageService.save("configurations", savingData);

//   // schemas.set(get(schemas));
//   // protocols.set(get(protocols));
//   // businessOperations.set(get(businessOperations));
// };

// // eslint-disable-next-line max-lines-per-function
// export const loadConfigurationsFromStore = () : void => {
//   if (localStorageService.isInStorage("configurations")) {
//     const configurationsData = localStorageService.fetchKey("configurations") as object[];
//     const rawConfigs : Configuration[] = [];

//     configurationsData.forEach((value) => {
//       const businessOperations = (value["businessOperations"] as any[]).map((bop) => new UIBusinessOperation(bop));
//       const envs = (value["envs"] as any[]).map((env) => new EnvironmentVariable(env));
//       const protocols = (value["protocols"] as any[]).map((protocol) => new Protocol(protocol));
//       const schemas = (value["schemas"] as any[]).map((schema) => new Schema(schema));

//       rawConfigs.push(new Configuration({ ...value, businessOperations, envs, protocols, schemas } as any));
//     });

//     availableConfigurations.set(rawConfigs);
//   };

//   // setCurrentConfigData(get(currentProject).getConfiguration());
//   // startConfigurationStoreSync();
// };
