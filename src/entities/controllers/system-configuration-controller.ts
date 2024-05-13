import { nanoid } from "nanoid";
import { SystemConfiguration } from "../models/system-configuration";
import { SystemConfigurationMutations } from "../mutations/system-configuration-mutations";
import { PanelsMutations } from "../mutations/panels-mutations";
import { systemConfigurationsStore } from "../stores/system-configurations-store";
import { ConfigurationFileSystemController } from "./file-system-controller-functions/versions";
import { Project } from "../models/project";
import { ProjectsController } from "./projects-controller";
import { ProjectsMutations } from "../mutations/projects-mutations";

export class SystemConfigurationController {
  public static loadConfigurationIntoView (configurationId : string) : void {
    const configuration = systemConfigurationsStore.getItemById(configurationId);

    SystemConfigurationMutations.openConfiguration(configurationId);
    PanelsMutations.SetAvailableViewsByLoadingConfiguration(configuration.toEntity());
  }

  public static async loadConfiguration (parentProject : Project, configId : string) : Promise<void> {
    return ConfigurationFileSystemController.readConfigurationFile(parentProject, configId).then(config => {
      if(SystemConfigurationMutations.configIsLoaded(configId)) {
        SystemConfigurationMutations.updateConfiguration(config);
      } else SystemConfigurationMutations.addConfiguration(config);
    });
  }

  public static async update (parentProject : Project, configuration : SystemConfiguration) : Promise<void> {
    return ConfigurationFileSystemController.update(parentProject, configuration).then(() => {
      ProjectsController.loadProject(parentProject.identifier).then(() => {
        SystemConfigurationMutations.updateConfiguration(configuration);
      }).catch(error => { console.error("Error while updating project references", error); });
    }).catch(error => { console.error("Error while updating configuration", error); });
  }

  public static async archive (parentProject : Project, configurationId : string) : Promise<void> {
    SystemConfigurationMutations.removeConfiguration(configurationId);
    parentProject.removeVersionById(configurationId);
    ProjectsMutations.updateLoadedProject(parentProject);
    const versionInfo = parentProject.versions.find(version => version.identifier == configurationId);
    return ConfigurationFileSystemController.archiveConfiguration(parentProject, versionInfo);
  }

  public static async duplicateConfiguration (parentProject : Project, configId : string) : Promise<void> {
    const versionInfo = parentProject.versions.find(version => version.identifier === configId);
    return ConfigurationFileSystemController.duplicate(versionInfo, parentProject);
  }

  public static TESTAddAndLoadConfiguration () : void {
    const stubConfig = new SystemConfiguration();
    stubConfig.addons = [];
    stubConfig.businessOperations = [];
    stubConfig.envs = [];
    stubConfig.name = "my Test Config";
    stubConfig.projectId = nanoid();
    stubConfig.schemas = [
      {
        "format": {},
        "identifier": nanoid(),
        "name": "My Schema",
      },
    ];
    stubConfig.version = "0.0.1";

    SystemConfigurationMutations.addConfiguration(stubConfig);
    SystemConfigurationController.loadConfigurationIntoView(stubConfig.identifier);
  }
}
