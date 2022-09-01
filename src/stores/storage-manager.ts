/* eslint-disable max-classes-per-file */

import { get, Writable } from "svelte/store";
import { Configuration } from "../entities/configuration";
import { Project } from "../entities/project";
import { availableConfigurations } from "./configuration-store";
import { LocalStorageManager } from "./local-storage";
import { availableProjects } from "./projects-store";

type Stores = {
  configurationsStore : Writable<Configuration[]>;
  projectsStore : Writable<Project[]>;
}

export interface StorageManagerType {
  loadProjectsToStores : (userAuth : string) => Promise<void>;
  loadVersionsToStores : (userAuth : string, projectId : string) => Promise<void>;
  updateVersions : (userAuth : string, versions : Configuration[]) => Promise<void>;
  updateProjects : (userAuth : string, projects : Project[]) => Promise<void>;
};

class MapikitStorageManager<T extends StorageManagerType> {
  private userToken : string;
  constructor (private manager : T, private stores : Stores) {}

  public set userAuth (newToken : string) { this.userToken = newToken; }

  async loadAllInfo () : Promise<void> {
    console.log("Starting info load...");
    await this.manager.loadProjectsToStores(this.userToken);
    await this.assessProjectsSuccess();
    console.log("Loaded Projects:", get(this.stores.projectsStore));
    for(const project of get(this.stores.projectsStore)) {
      console.log("Loading versions from:", project);
      await this.manager.loadVersionsToStores(this.userToken, get(project.id));
      console.log("Done");
    }
    await this.assessVersionsSuccess();
    console.log("Loaded Versions:", get(this.stores.configurationsStore));
  }

  public subscribeUpdates () : void {
    this.stores.configurationsStore.subscribe(configurations => {
      this.manager.updateVersions(this.userToken, configurations)
        .catch(err => { throw err; });
    });
    this.stores.projectsStore.subscribe(projects => {
      this.manager.updateProjects(this.userToken, projects)
        .catch(err => { throw err; });
    });
  }

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
      }, 200);
    });
  }
}


const manager = new LocalStorageManager();
const storageManager = new MapikitStorageManager(
  manager,
  {
    configurationsStore: availableConfigurations,
    projectsStore: availableProjects,
  },
);

export { storageManager };
