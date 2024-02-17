import { get } from "svelte/store";
import { InjectedWindow } from "../../common/types/injected-window.js";
import { Project } from "../models/project.js";
import { SystemConfiguration } from "../models/system-configuration";
import projectsStore from "../stores/projects-store.js";
import { SystemConfigurationStore, systemConfigurationsStore } from "../stores/system-configurations-store.js";
import { MetaEditorInfoType } from "../../common/types/meta-editor-info.js";

export class FileSystemController {
  private static fileApi = (window as InjectedWindow).fileApi;

  public static getProjectsList = this.fileApi.getAvailableProjects;

  public static fetchImportedProjects () : void {}

  public static async importProject (projectName : string) : Promise<Project> {
    const projectInfo = await this.fileApi.getProjectInfo(projectName);
    return new Project(projectInfo);
  }

  public static async importVersion (parentProject : Project, version : string) : Promise<SystemConfiguration> {
    const versionInfo = await this.fileApi.getVersion(parentProject.projectName, version);
    return new SystemConfiguration(versionInfo, parentProject.identifier);
  }

  /** Loads project from saved files */
  public static async loadProject (projectName : string) : Promise<Project> {
    const project = await this.importProject(projectName);
    projectsStore.items.update(items => {
      const index = items.findIndex(item => item.projectName === projectName);
      if(index !== -1) items[index] = project;
      else items.push(project);
      return items;
    });
    return project;
  }

  /** Loads project configuration (version) from saved files */
  public static async loadConfiguration (parentProject : Project,  versionString : string) : Promise<void> {
    const version = await this.importVersion(parentProject, versionString);
    systemConfigurationsStore.items.update(items => {
      const index = items.findIndex(item =>
        get(item.version) === versionString && get(item.projectId) === parentProject.identifier);
      if(index !== -1) items[index] = new SystemConfigurationStore(version);
      else items.push(new SystemConfigurationStore(version));
      return items;
    });
  }

  public static async loadAllProjectConfigurations (project : Project) : Promise<void> {
    const versionsStrings = project.listVersions();
    const versions : Array<SystemConfigurationStore> = [];
    for(const version of versionsStrings) {
      const versionInfo = await this.importVersion(project, version);
      versions.push(new SystemConfigurationStore(versionInfo));
    }
    systemConfigurationsStore.items.update(items => {
      return [
        ...items.filter(item => get(item.projectId) !== project.identifier),
        ...versions,
      ];
    });
  }

  public static async loadProjectAndVersions (projectName : string) : Promise<void> {
    const project = await this.loadProject(projectName);
    await this.loadAllProjectConfigurations(project);
  }

  public static async loadAllProjects () : Promise<void> {
    const availableProjects = await this.getProjectsList();
    for(const project of availableProjects) await this.loadProject(project);
  }

  public static async loadAllProjectsAndVersions () : Promise<void> {
    const availableProjects = await this.getProjectsList();
    for(const project of availableProjects) await this.loadProjectAndVersions(project);
  }

  public static async duplicateConfiguration (current : SystemConfiguration, parentProject : Project) : Promise<void> {
    const registeredVersions = parentProject.listVersions();
    const highestVersion = registeredVersions.sort((versionA, versionB) => versionB.localeCompare(versionA))[0];
    const newVersion = this.getNewVersion(highestVersion);
    const newConfigEntity =
      new SystemConfiguration({ ...current.duplicate, version: newVersion }, parentProject.identifier);
    await this.saveConfiguration(parentProject, newConfigEntity);
  }

  private static getNewVersion (version : string) : string {
    const versionSections = version.split(".");
    const lastSectionNumber = Number(versionSections[2].match(/\d+/)[0]);
    versionSections[2] = versionSections[2].replace(
      lastSectionNumber.toString(),
      (lastSectionNumber+1).toString(),
    );
    return versionSections.join(".");
  }

  public static async saveConfiguration (parentProject : Project, version : SystemConfiguration) : Promise<void> {
    await this.fileApi.saveVersion(parentProject.toJson(), version.toJson(), {} as MetaEditorInfoType);
    systemConfigurationsStore.items.update(items => {
      const itemIndex = items.findIndex(item => item.identifier === version.identifier);
      if(itemIndex > -1) items[itemIndex] = new SystemConfigurationStore(version);
      else items.push(new SystemConfigurationStore(version));
      return items;
    });

    // Reloads project with new paths
    await this.loadProject(parentProject.projectName);
  }

  public static async saveProject (parentProject : Project) : Promise<void> {
    await this.fileApi.saveProjectInfo(parentProject.toJson());
  }


  public static async removeConfiguration (parentProject : Project, version : SystemConfiguration) : Promise<void> {
    systemConfigurationsStore.items.update(items => {
      const itemIndex = items.findIndex(item => item.identifier === version.identifier);
      items.splice(itemIndex, 1);
      return items;
    });

    projectsStore.items.update(projects => {
      const index = projects.findIndex(project => project.identifier === parentProject.identifier);
      parentProject.removeVersion(version.version);
      projects[index] = parentProject;
      return projects;
    });

    await this.saveProject(parentProject);
    await this.fileApi.deleteVersion(parentProject.toJson(), version.version);
  }
}
