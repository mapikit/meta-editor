import { get } from "svelte/store";
import { ProjectVersionInfo } from "../../../common/types/project-config-type";
import { Project } from "../../models/project";
import projectsStore from "../../stores/projects-store";
import { systemConfigurationsStore } from "../../stores/system-configurations-store";
import { InjectedWindow } from "../../../common/types/injected-window";
import { FSCreateFunctions } from "./update";

export class FSDeleteFunctions {
  private static fileApi = (window as InjectedWindow).fileApi;

  // eslint-disable-next-line max-lines-per-function
  public static async configuration (parentProject : Project, version : ProjectVersionInfo) : Promise<void> {
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

    await FSCreateFunctions.project(parentProject);
    await this.fileApi.deleteVersion(parentProject.toJson(), version.version);
  }

  public static async project (project : Project) : Promise<void> {
    systemConfigurationsStore.items.update(items => {
      return items.filter(item => get(item.projectId) !== project.identifier);
    });

    projectsStore.items.update(projects => {
      return projects.filter(_project => _project.identifier !== project.identifier);
    });

    await this.fileApi.deleteProject(project.toJson());
  }
}
