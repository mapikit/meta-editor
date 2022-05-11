import type { Project } from "./project";
import { writable, Writable } from "svelte/store";

type UserConstructorArgument =
  { id : string; email : string; projects ?: Project[] }

export class User {
  public readonly projects : Writable<Project[]> = writable([]);
  public readonly id : Writable<string> = writable("");
  public readonly email : Writable<string> = writable("");

  public constructor ({ id, email, projects = []} : UserConstructorArgument) {
    this.id.set(id);
    this.email.set(email);
    this.projects.set(projects);
  }
}
