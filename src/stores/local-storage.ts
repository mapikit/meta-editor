/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Configuration } from "../entities/configuration";
import type { Project } from "../entities/project";
import { loadConfigurationsFromStore, saveConfigurations } from "./configuration-store";
import { loadProjectsFromStore, saveProjects } from "./projects-store";
import type { StorageManagerType } from "./storage-manager";

export class LocalStorageManager implements StorageManagerType {
  private alreadyLoaded = false;
  async updateVersions (userAuth : string, versions : Configuration[]) : Promise<void> { saveConfigurations(); };
  async updateProjects (userAuth : string, projects : Project[]) : Promise<void> { saveProjects(); };
  async loadProjectsToStores () : Promise<void> { loadProjectsFromStore(); };
  async loadVersionsToStores () : Promise<void> {
    if(this.alreadyLoaded) return; //Temp workaround
    loadConfigurationsFromStore();
    this.alreadyLoaded = true;
  };
}
