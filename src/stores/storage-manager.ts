/* eslint-disable max-classes-per-file */

import { get, Unsubscriber, Writable } from "svelte/store";
import { getDeepStoreObject } from "../components/architect/helpers/get-deep-store-obj";
import type { UIBusinessOperation } from "../entities/business-operation";
import { Configuration } from "../entities/configuration";
import { Project } from "../entities/project";
import type { Protocol } from "../entities/protocol";
import type { Schema } from "../entities/schema";
import { availableConfigurations, startConfigurationStoreSync } from "./configuration-store";
import { HttpStorageManager } from "./http-storage";
// import { LocalStorageManager } from "./local-storage";
import { availableProjects } from "./projects-store";

type Stores = {
  configurationsStore : Writable<Configuration[]>;
  projectsStore : Writable<Project[]>;
}

export interface StorageManagerType {
  loginUser (email : string, password : string) : Promise<void>;
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
};

class MapikitStorageManager<T extends StorageManagerType> {
  private unsubscribers : Unsubscriber[] = [];
  constructor (public manager : T, private stores : Stores) {}

  public async login (email : string, password : string) : Promise<void> {
    await this.manager.loginUser(email, password);
  }

  public unsubscribeAll () : void { for(const unsubscribe of this.unsubscribers) unsubscribe(); }

  async loadAllInfo () : Promise<void> {
    await this.manager.refreshUserAuth();
    await this.manager.loadProjectsToStores();
    await this.assessProjectsSuccess();

    this.stores.configurationsStore.set([]);
    for(const project of get(this.stores.projectsStore)) {
      await this.manager.loadVersionsToStores(get(project.id));
    }
    await this.assessVersionsSuccess();

    startConfigurationStoreSync();

    console.log(getDeepStoreObject(this.stores.configurationsStore));
    console.log(getDeepStoreObject(this.stores.projectsStore));
  }

  // eslint-disable-next-line max-lines-per-function

  private async assessProjectsSuccess () : Promise<void> {
    let tries = 20;
    while (tries > 0) {
      tries--;
      const isValid = await MapikitStorageManager.verifyFunction(this.stores.projectsStore, Project);
      if(isValid) break;
    }
  }

  private async assessVersionsSuccess () : Promise<void> {
    let tries = 20;
    while (tries > 0) {
      tries--;
      const isValid = await MapikitStorageManager.verifyFunction(this.stores.configurationsStore, Configuration);
      if(isValid) break;
    }
  }

  private static verifyFunction (storeToCompare : Writable<unknown>, instance) : Promise<boolean> {
    //TODO improve this to be less "GREEDY" (previous data)
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const value = get(storeToCompare);
          if(value["length"] === 0) return resolve(false);
          const firstProject = value[0];
          if(firstProject instanceof instance) resolve(true);
        } catch (err) { resolve(false); }
        resolve(false);
      }, 200);
    });
  }
}


const manager = new HttpStorageManager();

const storageManager = new MapikitStorageManager(
  manager,
  {
    configurationsStore: availableConfigurations,
    projectsStore: availableProjects,
  },
);

// eslint-disable-next-line max-len
export { storageManager };
