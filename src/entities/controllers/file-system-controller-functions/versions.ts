import { Project } from "../../models/project";
import { InjectedWindow } from "../../../common/types/injected-window";
import { SystemConfiguration } from "../../models/system-configuration";
import { MetaEditorInfoType } from "../../../common/types/meta-editor-info";

export class ConfigurationFileSystemController {
  private static fileApi = (window as InjectedWindow).fileApi;

  public static async archiveConfiguration (parentProject : Project, versionId : string) : Promise<void> {
    await this.fileApi.archiveVersion(parentProject.toJson(), versionId);
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

  public static async loadAllFromProject (parentProject : Project) : Promise<SystemConfiguration[]> {
    const versions = parentProject.versions.map(v => v.identifier);
    const allConfigurationsPromise = versions.map(v => this.fileApi.getVersion(parentProject.identifier, v));

    const allConfigurations = await Promise.all(allConfigurationsPromise);
    return allConfigurations.map(c => new SystemConfiguration(c, parentProject.identifier));
  }
}
