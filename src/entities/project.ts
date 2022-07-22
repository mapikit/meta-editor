import { availableProjects, saveProjects } from "../stores/projects-store";
import { get, readable, Readable, writable, Writable } from "svelte/store";
import { Configuration } from "./configuration";
import { availableConfigurations } from "../stores/configuration-store";

type ProjectContructorParameter = {
  id : string;
  name : string;
  description : string;
  isStarred : boolean;
}

export class Project {
  public readonly id : Readable<string>;
  public readonly name : Writable<string> = writable("");
  public readonly description : Writable<string> = writable("");
  public readonly isStarred : Writable<boolean> = writable(false);

  constructor ({ id, name, description, isStarred } : ProjectContructorParameter) {
    this.id = readable(id);
    this.name.set(name);
    this.description.set(description);
    this.isStarred.set(isStarred);

    this.keepStorageUpdated();
  }

  public getConfigurations () : Configuration[] {
    return get(availableConfigurations)
      .filter((config) => { return get(config.projectId) === get(this.id); });
  }

  public static getNullable () : Project {
    return new Project({
      id: "",
      name: "",
      description: "",
      isStarred: false,
    });
  }

  /** Saves to the BackEnd */
  public async save () : Promise<void> {
    // TODO: Implement
  }

  // eslint-disable-next-line max-lines-per-function
  public static async addNewProject () : Promise<void> {
    // We should add a new new system in the backEnd instantly here.
    // Then modify the store with the new values

    const newProject = new Project({
      id: Math.floor(Math.random()*1000000).toString(),
      name: "New System",
      description: "system's description.",
      isStarred: false,
    });

    availableProjects.update((current) => {
      current.push(newProject);

      return current;
    });

    availableConfigurations.update((current) => {
      current.push(new Configuration({
        id: "MOCK_ID",
        projectId: get(newProject.id),
        version: "0.0.1",
      }));

      return current;
    });
  }

  public getConfiguration () : Configuration {
    return get(availableConfigurations).find((configuration) => {
      return get(configuration.projectId) === get(this.id);
    }) ?? Configuration.getNullable();
  }

  public serialized () : object {
    return {
      id: get(this.id),
      name: get(this.name),
      description: get(this.description),
      isStarred: get(this.isStarred),
    };
  }

  private keepStorageUpdated () : void {
    this.id.subscribe(saveProjects);
    this.name.subscribe(saveProjects);
    this.description.subscribe(saveProjects);
    this.isStarred.subscribe(saveProjects);
  }
}
