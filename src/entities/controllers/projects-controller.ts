import { Project } from "../models/project";
import projectsStore from "../stores/projects-store";
import { FileSystemController } from "./file-system-controller";

export class ProjectsController {
  static async createNewProject () : Promise<void> {
    const newProject = Project.newEmpty();
    await FileSystemController.projectsController.update(newProject);
    projectsStore.items.update((projects) => {
      projects.push(newProject);
      return projects;
    });
  }

  static async saveProject (project : Project) : Promise<void> {
  }

  static async loadProject (projectName : string) : Promise<void> {
  }
}
