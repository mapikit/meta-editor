import { ProjectVersionInfo } from "../../../common/types/serializables/project-config-type";
import { Project } from "../../models/project";
import { InjectedWindow } from "../../../common/types/injected-window";
import { SystemConfiguration } from "../../models/system-configuration";
import { MetaEditorInfoType } from "../../../common/types/meta-editor-info";
import { ProjectsFileSystemController } from "./projects";

export class ConfigurationFileSystemController {
  private static fileApi = (window as InjectedWindow).fileApi;

  public static async archiveConfiguration (parentProject : Project, version : ProjectVersionInfo) : Promise<void> {
    await this.fileApi.archiveVersion(parentProject.toJson(), version.identifier);
    parentProject.removeVersionById(version.identifier);
    await ProjectsFileSystemController.update(parentProject);
  }

  public static async readConfigurationFile (parentProject : Project, version : string)
    : Promise<SystemConfiguration> {
    const versionInfo = await this.fileApi.getVersion(parentProject.identifier, version);
    return new SystemConfiguration(versionInfo, parentProject.identifier);
  }

  // Update Functions
  public static async update (parentProject : Project, version : SystemConfiguration) : Promise<void> {
    await this.fileApi.saveVersion(parentProject.toJson(), version.toJson(), {} as MetaEditorInfoType);
  }
}
