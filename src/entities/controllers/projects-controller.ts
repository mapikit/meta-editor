import { get } from "svelte/store";
import { Project } from "../models/project";
import { systemConfigurationsStore } from "../stores/system-configurations-store";
import { ProjectsFileSystemController } from "./file-system-controller-functions/projects";
import { ProjectsMutations } from "../mutations/projects-mutations";
import { SystemConfigurationMutations } from "../mutations/system-configuration-mutations";
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

  static async deleteProject (project : Project) : Promise<void> {
    ProjectsFileSystemController.delete(project).then(() => {
      SystemConfigurationMutations.removeConfigurationsByProjectId(project.identifier);
      ProjectsMutations.removeProject(project.identifier);
    }).catch(error => console.error("Error while deleting project", error));
  }

  static async loadProject (projectId : string) : Promise<void> {
    const projectInfo = await ProjectsFileSystemController.readProjectFile(projectId);
    if(ProjectsMutations.projectIsLoaded(projectId)) ProjectsMutations.updateLoadedProject(projectInfo);
    else ProjectsMutations.addProjectToList(projectInfo);
  }

  public static async loadAllProjects () : Promise<void> {
    const availableProjects = await ProjectsFileSystemController.getList();
    for(const project of availableProjects) await this.loadProject(project);
  }

  public static async archiveProject (project : Project) : Promise<void> {
    return ProjectsFileSystemController.archive(project).then(() => {
      ProjectsMutations.removeProject(project.identifier);

      systemConfigurationsStore.items.update(items => {
        return items.filter(item => get(item.projectId) !== project.identifier);
      });
    }).catch(error => console.error("Error while archiving project", error));
  }

  public static async update (project : Project) : Promise<void> {
    return ProjectsFileSystemController.update(project).then(() => {
      ProjectsMutations.updateLoadedProject(project);
    }).catch(error => console.error("Unable to update project", error));
  }
}
