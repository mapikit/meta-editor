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
}
