import { InjectedWindow } from "../../../common/types/injected-window";
import { MetaEditorInfoType } from "../../../common/types/meta-editor-info";
import { ProjectVersionInfo } from "../../../common/types/project-config-type";
import { Project } from "../../models/project";
import { SystemConfiguration } from "../../models/system-configuration";
import { systemConfigurationsStore, SystemConfigurationStore } from "../../stores/system-configurations-store";
import { FSReadFunctions } from "./load";

export class FSCreateFunctions {
  private static fileApi = (window as InjectedWindow).fileApi;


  public static async duplicateConfiguration (current : ProjectVersionInfo, parentProject : Project) : Promise<void> {
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
    await FSReadFunctions.project(parentProject.projectName);
  }

  public static async project (parentProject : Project) : Promise<void> {
    await this.fileApi.saveProjectInfo(parentProject.toJson());
  }
}
