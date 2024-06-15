// eslint-disable-next-line max-classes-per-file
import { Readable, Writable, get, readable, writable } from "svelte/store";
import { ProjectVersionInfo } from "../../common/types/serializables/project-config-type";
import { Project } from "../models/project";
import { StoreEntityModel } from "../models/store-model";
import { SelectedGenericStore } from "./selected-generic-store";

export class ProjectVersionInfoStore implements StoreEntityModel<ProjectVersionInfo> {
  public readonly identifier : string;
  public readonly version : Writable<string> = writable("0.0.1");
  public readonly name : Writable<string> = writable("New Version");
  public readonly updatedAt : Writable<string> = writable(new Date(Date.now()).toISOString());
  public readonly createdAt : Writable<string> = writable(new Date(Date.now()).toISOString());

  public constructor (parameter : ProjectVersionInfo) {
    this.identifier = parameter.identifier;
    this.version.set(parameter.version);
    this.name.set(parameter.name);
    this.updatedAt.set(parameter.updatedAt);
    this.createdAt.set(parameter.createdAt);
  }

  public toEntity () : ProjectVersionInfo {
    return {
      identifier: this.identifier,
      version: get(this.version),
      name: get(this.name),
      updatedAt: get(this.updatedAt),
      createdAt: get(this.createdAt),
    };
  }
}


export class ProjectStore implements StoreEntityModel<Project> {
  private readonly originalProject : Project;

  public constructor (configuration : Project) {
    this.originalProject = configuration;

    this.projectName = writable(configuration.projectName);
    this.description = writable(configuration.description);
    this.identifier = configuration.identifier;
    this.versions = writable(configuration.versions.map(v => new ProjectVersionInfoStore(v)));
    this.createdAt = readable(configuration.createdAt);
    this.updatedAt = writable(configuration.updatedAt);
  }

  public projectName : Writable<string> = writable("");
  public description : Writable<string> = writable("");
  public identifier : string;
  public versions : Writable<ProjectVersionInfoStore[]>;
  public createdAt : Readable<Date>;
  public updatedAt : Writable<Date> = writable(new Date());

  public toEntity () : Project {
    const result = new Project({
      createdAt: get(this.createdAt).toISOString(),
      description: get(this.description),
      identifier: this.identifier,
      projectName: get(this.projectName),
      updatedAt: get(this.updatedAt).toISOString(),
      versions: get(this.versions).map(v => v.toEntity()),
    });

    return result;
  }

  /** updates from entity */
  public update (entity : Project) : void {
    this.description.set(entity.description);
    this.projectName.set(entity.projectName);
    this.versions.set(entity.versions.map(v => new ProjectVersionInfoStore(v)));
    this.updatedAt.set(entity.updatedAt);
  }

  listVersions : never;
  hasVersion : never;
  isVersionValid : never;
  removeVersion : never;
  removeVersionById : never;
  addVersion : never;
  toJson : never;
  getLatestVersionIdentifier : never;
  getVersionNavigationPath : never;
  cloneToNew : never;
  rerollVersionsIds : never;
}

export const projectsStore = new SelectedGenericStore<ProjectStore>();
