import { Project } from "../models/project";
import projectsStore from "../stores/projects-store";
import { EditorMetadataController } from "./editor-metadata-controller";
import { FileSystemController } from "./file-system-controller";

export class ProjectsController {
  static async createNewProject () : Promise<void> {
    const newProject = Project.newEmpty();
    await FileSystemController.projectsController.update(newProject);
    projectsStore.items.update((projects) => {
      projects.push(newProject);
      return projects;
    });
    await EditorMetadataController.appendProjectIdentifier(newProject.identifier);
    await EditorMetadataController.saveCurrentMetadata();
  }

  static async saveProject (project : Project) : Promise<void> {
  }

  static async loadProject (projectName : string) : Promise<void> {
  }
}
