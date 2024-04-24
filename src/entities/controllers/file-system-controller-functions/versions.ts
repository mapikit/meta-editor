import { get } from "svelte/store";
import { ProjectVersionInfo } from "../../../common/types/project-config-type";
import { Project } from "../../models/project";
import projectsStore from "../../stores/projects-store";
import { SystemConfigurationStore, systemConfigurationsStore } from "../../stores/system-configurations-store";
import { InjectedWindow } from "../../../common/types/injected-window";
import { SystemConfiguration } from "../../models/system-configuration";
import { MetaEditorInfoType } from "../../../common/types/meta-editor-info";
import { ProjectsFileSystemController } from "./projects";

export class VersionsFileSystemController {
  private static fileApi = (window as InjectedWindow).fileApi;

  // eslint-disable-next-line max-lines-per-function
  public static async archive (parentProject : Project, version : ProjectVersionInfo) : Promise<void> {
    systemConfigurationsStore.items.update(items => {
      const projectConfigs = items.filter(item => get(item.projectId) === parentProject.identifier);
      const itemIndex = projectConfigs.findIndex(item => get(item.version) === version.version);
      items.splice(itemIndex, 1);
      return items;
    });

    projectsStore.items.update(projects => {
      const index = projects.findIndex(project => project.identifier === parentProject.identifier);
      parentProject.removeVersion(version.version);
      projects[index] = parentProject;
      return projects;
    });

    await ProjectsFileSystemController.update(parentProject);
    await this.fileApi.archiveVersion(parentProject.toJson(), version.version);
  }

  // eslint-disable-next-line max-lines-per-function
  public static async delete (parentProject : Project, version : ProjectVersionInfo) : Promise<void> {
    systemConfigurationsStore.items.update(items => {
      const projectConfigs = items.filter(item => get(item.projectId) === parentProject.identifier);
      const itemIndex = projectConfigs.findIndex(item => get(item.version) === version.version);
      items.splice(itemIndex, 1);
      return items;
    });

    projectsStore.items.update(projects => {
      const index = projects.findIndex(project => project.identifier === parentProject.identifier);
      parentProject.removeVersion(version.version);
      projects[index] = parentProject;
      return projects;
    });

    await ProjectsFileSystemController.update(parentProject);
    await this.fileApi.deleteVersion(parentProject.toJson(), version.version);
  }

  private static async import (parentProject : Project, version : string) : Promise<SystemConfiguration> {
    const versionInfo = await this.fileApi.getVersion(parentProject.projectName, version);
    return new SystemConfiguration(versionInfo, parentProject.identifier);
  }

  public static async load (parentProject : Project,  versionString : string) : Promise<void> {
    const version = await this.import(parentProject, versionString);
    systemConfigurationsStore.items.update(items => {
      const index = items.findIndex(item =>
        get(item.version) === versionString && get(item.projectId) === parentProject.identifier);
      if(index !== -1) items[index] = new SystemConfigurationStore(version);
      else items.push(new SystemConfigurationStore(version));
      return items;
    });
  }


  public static async loadByProject (project : Project) : Promise<void> {
    const versionsStrings = project.listVersions();
    const versions : Array<SystemConfigurationStore> = [];
    for(const version of versionsStrings) {
      const versionInfo = await this.import(project, version);
      versions.push(new SystemConfigurationStore(versionInfo));
    }
    systemConfigurationsStore.items.update(items => {
      return [
        ...items.filter(item => get(item.projectId) !== project.identifier),
        ...versions,
      ];
    });
  }

  // Update Functions
  public static async duplicate (current : ProjectVersionInfo, parentProject : Project) : Promise<void> {
    const registeredVersions = parentProject.listVersions();
    const config = await this.fileApi.getVersion(parentProject.projectName, current.version);
    const highestVersion = registeredVersions.sort((versionA, versionB) => versionB.localeCompare(versionA))[0];
    const newVersion = this.getNewVersion(highestVersion);
    const newConfigEntity =
          new SystemConfiguration({ ...config, version: newVersion }, parentProject.identifier);
    await this.configuration(parentProject, newConfigEntity);
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

  public static async configuration (parentProject : Project, version : SystemConfiguration) : Promise<void> {
    await this.fileApi.saveVersion(parentProject.toJson(), version.toJson(), {} as MetaEditorInfoType);
    systemConfigurationsStore.items.update(items => {
      const itemIndex = items.findIndex(item => item.identifier === version.identifier);
      if(itemIndex > -1) items[itemIndex] = new SystemConfigurationStore(version);
      else items.unshift(new SystemConfigurationStore(version));
      return items;
    });

    // Reloads project with new paths
    await ProjectsFileSystemController.load(parentProject.projectName);
  }
}
