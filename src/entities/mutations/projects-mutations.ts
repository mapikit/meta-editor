import { get } from "svelte/store";
import { Project } from "../models/project";
import { ProjectStore, projectsStore } from "../stores/projects-store";

export class ProjectsMutations {
  public static openProject (projectId : string) : void {
    if (!projectsStore.hasItem(projectId)) { return; }

    projectsStore.currentlyOpenItemId.set(projectId);
  }

  public static addProjectToList (project : Project) : void {
    if (projectsStore.hasItem(project.identifier)) { return; }

    projectsStore.items.update((current) => {
      current.push(new ProjectStore(project));
      return current;
    });
  }

  public static updateLoadedProject (project : Project) : void {
    if (!this.projectIsLoaded(project.identifier)) { return; }

    projectsStore.items.update((current) => {
      const toUpdate = current.find(_project => _project.identifier === project.identifier);
      for(const key  of Object.keys(project)) {
        if(toUpdate[key]["update"]) toUpdate[key].update(() => project[key]);
      }
      return current;
    });
  }

  public static getCurrentlySelected () : ProjectStore {
    return get(projectsStore.currentlyOpenItems);
  }

  public static projectIsLoaded (projectId : string) : boolean {
    return projectsStore.hasItem(projectId);
  }

  public static removeProject (projectId : string) : void {
    projectsStore.items.update(projects => {
      return projects.filter(_project => _project.identifier !== projectId);
    });
  }
}
