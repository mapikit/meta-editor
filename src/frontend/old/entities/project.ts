import { get, readable, Readable, writable, Writable } from "svelte/store";
import { Configuration } from "./configuration";
import { availableConfigurations } from "../stores/configuration-store";
import { nanoid } from "nanoid";
import type { Serialized } from "./serialized-type";

type ProjectConstructorParameter = {
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

  constructor ({ id, name, description, isStarred } : ProjectConstructorParameter) {
    this.id = readable(id);
    this.name.set(name);
    this.description.set(description);
    this.isStarred.set(isStarred);
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
  public static createNewProject () : Project {
    // We should add a new new system in the backEnd instantly here.
    // Then modify the store with the new values

    const newProject = new Project({
      id: nanoid(),
      name: "New System",
      description: "system's description.",
      isStarred: false,
    });

    return newProject;
  }

  public getConfiguration () : Configuration {
    return get(availableConfigurations).find((configuration) => {
      return get(configuration.projectId) === get(this.id);
    }) ?? Configuration.getNullable();
  }

  public serialized () : Serialized<Project> {
    return {
      id: get(this.id),
      name: get(this.name),
      description: get(this.description),
      isStarred: get(this.isStarred),
    };
  }
}
