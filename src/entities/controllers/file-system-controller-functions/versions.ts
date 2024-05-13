import { ProjectVersionInfo } from "../../../common/types/serializables/project-config-type";
import { Project } from "../../models/project";
import { InjectedWindow } from "../../../common/types/injected-window";
import { SystemConfiguration } from "../../models/system-configuration";
import { MetaEditorInfoType } from "../../../common/types/meta-editor-info";
import { ProjectsFileSystemController } from "./projects";

export class ConfigurationFileSystemController {
  private static fileApi = (window as InjectedWindow).fileApi;

  // eslint-disable-next-line max-lines-per-function
  public static async archiveConfiguration (parentProject : Project, version : ProjectVersionInfo) : Promise<void> {
    await ProjectsFileSystemController.update(parentProject);
    await this.fileApi.archiveVersion(parentProject.toJson(), version.version);
  }

  public static async readConfigurationFile (parentProject : Project, version : string)
    : Promise<SystemConfiguration> {
    const versionInfo = await this.fileApi.getVersion(parentProject.identifier, version);
    return new SystemConfiguration(versionInfo, parentProject.identifier);
  }

  // Update Functions
  public static async duplicate (current : ProjectVersionInfo, parentProject : Project) : Promise<void> {
    const registeredVersions = parentProject.listVersions();
    const config = await this.fileApi.getVersion(parentProject.identifier, current.version);
    const highestVersion = registeredVersions.sort((versionA, versionB) => versionB.localeCompare(versionA))[0];
    const newVersion = this.getNewVersion(highestVersion);
    const newConfigEntity =
          new SystemConfiguration({ ...config, version: newVersion }, parentProject.identifier);
    await this.update(parentProject, newConfigEntity);
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

  public static async update (parentProject : Project, version : SystemConfiguration) : Promise<void> {
    await this.fileApi.saveVersion(parentProject.toJson(), version.toJson(), {} as MetaEditorInfoType);
  }
}
