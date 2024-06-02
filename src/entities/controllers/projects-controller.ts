import { get } from "svelte/store";
import { Project } from "../models/project";
import { systemConfigurationsStore } from "../stores/system-configurations-store";
import { ProjectsFileSystemController } from "./file-system-controller-functions/projects";
import { ProjectsMutations } from "../mutations/projects-mutations";
import { SystemConfigurationMutations } from "../mutations/system-configuration-mutations";
import { ProjectStore, projectsStore } from "../stores/projects-store";
import { EditorMetadataController } from "./editor-metadata-controller";
import { ConfigurationFileSystemController } from "./file-system-controller-functions/versions";
import { SystemConfigurationController } from "./system-configuration-controller";
import { EditorMetadataMutations } from "../mutations/editor-metadata-mutations";

export class ProjectsController {
  static async createNewProject () : Promise<void> {
    const newProject = Project.newEmpty();
    await ProjectsFileSystemController.update(newProject);
    projectsStore.items.update((projects) => {
      projects.push(new ProjectStore(newProject));
      return projects;
    });
    await EditorMetadataController.appendProjectIdentifier(newProject.identifier);
    await EditorMetadataController.saveCurrentMetadata();
  }

  static async selectProject (project : Project) : Promise<void> {
    ProjectsMutations.openProject(project.identifier);
    const configurations = await ConfigurationFileSystemController.loadAllFromProject(project);
    SystemConfigurationMutations.setAvailableConfigurations(configurations);
  }

  static async createNewNextVersion (project : Project) : Promise<void> {
    await SystemConfigurationController.createNewEmptyConfiguration(project);
  }

  static async deleteProject (project : Project) : Promise<void> {
    ProjectsFileSystemController.delete(project).then(() => {
      SystemConfigurationMutations.removeConfigurationsByProjectId(project.identifier);
      ProjectsMutations.removeProject(project.identifier);
    }).catch(error => console.error("Error while deleting project", error));
  }

  static async loadProject (projectId : string) : Promise<void> {
    const projectInfo = await ProjectsFileSystemController.readProjectFile(projectId);
    if(ProjectsMutations.projectIsLoaded(projectId)) ProjectsMutations.updateFromEntity(projectInfo);
    else ProjectsMutations.addProjectToList(projectInfo);
  }

  public static async loadAllProjects () : Promise<void> {
    const availableProjects = await ProjectsFileSystemController.getList();
    for(const project of availableProjects) await this.loadProject(project);
  }

  public static async archiveProject (project : Project) : Promise<void> {
    await ProjectsFileSystemController.archive(project);
    ProjectsMutations.removeProject(project.identifier);
    systemConfigurationsStore.items.update(items => {
      return items.filter(item => get(item.projectId) !== project.identifier);
    });

    EditorMetadataMutations.removeProject(project.identifier);
    await EditorMetadataController.saveCurrentMetadata();
  }

  public static async update (project : Project) : Promise<void> {
    project.updatedAt = new Date(Date.now());
    return ProjectsFileSystemController.update(project).then(() => {
      ProjectsMutations.updateFromEntity(project);
    }).catch(error => console.error("Unable to update project", error));
  }

  public static async editLatestVersion (project : Project) : Promise<void> {
    await this.selectProject(project);
    const latestVersion = project.getLatestVersionIdentifier();
    if (!latestVersion) {

      return;
    }

    await SystemConfigurationController.loadConfiguration(project, latestVersion);
    await SystemConfigurationController.loadConfigurationIntoView(latestVersion);
  }
}
