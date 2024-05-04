import { get } from "svelte/store";
import { InjectedWindow } from "../../../common/types/injected-window";
import { Project } from "../../models/project";
import projectsStore from "../../stores/projects-store";
import { systemConfigurationsStore } from "../../stores/system-configurations-store";
import { VersionsFileSystemController } from "./versions";

export class ProjectsFileSystemController {
  private static fileApi = (window as InjectedWindow).fileApi;

  // Archive functions
  public static async archive (project : Project) : Promise<void> {
    systemConfigurationsStore.items.update(items => {
      return items.filter(item => get(item.projectId) !== project.identifier);
    });

    projectsStore.items.update(projects => {
      return projects.filter(_project => _project.identifier !== project.identifier);
    });

    await this.fileApi.archiveProject(project.toJson());
  }

  //Delete Functions
  public static async delete (project : Project) : Promise<void> {
    systemConfigurationsStore.items.update(items => {
      return items.filter(item => get(item.projectId) !== project.identifier);
    });

    projectsStore.items.update(projects => {
      return projects.filter(_project => _project.identifier !== project.identifier);
    });

    await this.fileApi.deleteProject(project.toJson());
  }

  public static getList = this.fileApi.getAvailableProjects;

  private static async readProjectFile (projectIdentifier : string) : Promise<Project> {
    const projectInfo = await this.fileApi.getProjectInfo(projectIdentifier);
    if(!projectInfo) throw Error("No config file found for project: " + projectIdentifier);
    return new Project(projectInfo);
  }

  // Load Functions
  public static async load (projectIdentifier : string) : Promise<void> {
    const project = await this.readProjectFile(projectIdentifier);
    projectsStore.items.update(items => {
      const index = items.findIndex(item => item.identifier === projectIdentifier);
      if(index !== -1) items[index] = project;
      else items.push(project);
      return items;
    });
  }

  public static async loadWithVersions (projectIdentifier : string) : Promise<void> {
    await this.load(projectIdentifier);
    const project = get(projectsStore.items).find(_project => _project.identifier === projectIdentifier);
    await VersionsFileSystemController.loadByProject(project);
  }

  public static async loadAll () : Promise<void> {
    const availableProjects = await this.getList();

    for(const projectId of availableProjects) await this.load(projectId);
  }

  public static async loadAllWithVersions () : Promise<void> {
    const availableProjects = await this.getList();
    for(const project of availableProjects) await this.loadWithVersions(project);
  }

  // Update Functions
  public static async update (parentProject : Project) : Promise<void> {
    await this.fileApi.saveProjectInfo(parentProject.toJson());
  }
}
