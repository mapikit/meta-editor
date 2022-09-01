import type { Configuration } from "../entities/configuration";
import type { Project } from "../entities/project";
import type { StorageManagerType } from "./storage-manager";

export class HttpStorageManager implements StorageManagerType {
  // Updates should likely have a delay to avoid too many requests
  updateVersions : (userAuth : string, versions : Configuration[]) => Promise<void>; //HTTP PUT UpdateVersion
  updateProjects : (userAuth : string, projects : Project[]) => Promise<void>; //HTTP PUT UpdateVersion
  loadProjectsToStores : (userAuth : string) => Promise<void>; //HTTP GET Projects
  loadVersionsToStores : (userAuth : string, projectId : string) => Promise<void>; //HTTP GET user-versions
};

