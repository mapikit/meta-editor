import type { Project } from "./project";
import { writable, Writable, readable, Readable, get } from "svelte/store";
import { selectedSystem } from "../components/systems-sidebar/systems-stores";

type UserConstructorArgument =
  { id : string; email : string; projects ?: Project[] }

export class User {
  public readonly projects : Writable<Project[]> = writable([]);
  public readonly id : Readable<string>;
  public readonly email : Writable<string> = writable("");

  public constructor ({ id, email, projects = [] } : UserConstructorArgument) {
    this.id = readable(id);
    this.email.set(email);
    this.projects.set(projects);
  }

  public async getProjects () : Promise<void> {
    // get projects in BackEnd;
  }

  public async _TEMP_setProjects (projects : Project[]) : Promise<void> {
    this.projects.set(projects);
  }

  public getCurrentProject () : Project {
    const systemId = get(selectedSystem);
    return get(this.projects).find((project) => get(project.id) === systemId);
  }
}
