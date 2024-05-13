import { Project } from "../models/project";
import projectsStore from "../stores/projects-store";

export class ProjectsMutations {
  public static openProject (projectId : string) : void {
    if (!projectsStore.hasItem(projectId)) { return; }

    projectsStore.currentlyOpenItemId.set(projectId);
  }

  public static addProjectToList (project : Project) : void {
    if (projectsStore.hasItem(project.identifier)) { return; }

    projectsStore.items.update((current) => {
      current.push(project);
      return current;
    });
  }

  public static updateLoadedProject (project : Project) : void {
    if (!this.projectIsLoaded(project.identifier)) { return; }

    projectsStore.items.update((current) => {
      const projectIndex = current.findIndex(_project => _project.identifier === project.identifier);
      current[projectIndex] = project;
      return current;
    });
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
