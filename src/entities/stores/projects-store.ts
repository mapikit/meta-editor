import { Readable, Writable, get, readable, writable } from "svelte/store";
import { ProjectVersionInfo } from "../../common/types/serializables/project-config-type";
import { Project } from "../models/project";
import { StoreEntityModel } from "../models/store-model";
import { SelectedGenericStore } from "./selected-generic-store";

export class ProjectStore implements StoreEntityModel<Project> {
  private readonly originalProject : Project;

  public constructor (configuration : Project) {
    this.originalProject = configuration;

    this.projectName = writable(configuration.projectName);
    this.description = writable(configuration.description);
    this.identifier = configuration.identifier;
    this.versions = writable(configuration.versions);
    this.createdAt = readable(configuration.createdAt);
    this.updatedAt = writable(configuration.updatedAt);
  }

  public projectName : Writable<string> = writable("");
  public description : Writable<string> = writable("");
  public identifier : string;
  public versions : Writable<ProjectVersionInfo[]>;
  public createdAt : Readable<Date>;
  public updatedAt : Writable<Date> = writable(new Date());

  public toEntity () : Project {
    const result = new Project({
      createdAt: get(this.createdAt).toISOString(),
      description: get(this.description),
      identifier: this.identifier,
      projectName: get(this.projectName),
      updatedAt: get(this.updatedAt).toISOString(),
      versions: get(this.versions),
    });

    return result;
  }

  listVersions : never;
  hasVersion : never;
  isVersionValid : never;
  removeVersion : never;
  removeVersionById : never;
  setVersion : never;
  toJson : never;
}

export const projectsStore = new SelectedGenericStore<ProjectStore>();
