import { SystemConfiguration } from "../models/system-configuration";
import { SystemConfigurationMutations } from "../mutations/system-configuration-mutations";
import { PanelsMutations } from "../mutations/panels-mutations";
import { ConfigurationFileSystemController } from "./file-system-controller-functions/versions";
import { Project } from "../models/project";
import { ProjectsController } from "./projects-controller";
import { ProjectsMutations } from "../mutations/projects-mutations";
import { getNextVersion } from "../../common/helpers/get-next-version";
import { SystemConfigurationStore, systemConfigurationsStore } from "../stores/system-configurations-store";
import { ProjectsFileSystemController } from "./file-system-controller-functions/projects";
import { ProjectVersionInfo } from "../../common/types/serializables/project-config-type";

export class SystemConfigurationController {
  /** Creates a new empty configuration, also updating the project accordingly.
   * If the project is provided, it will use it, otherwise, will use the currently open one.
   * The version of the new configuration is set by the next SEMVER version for the project.
   */
  public static async createNewEmptyConfiguration (usedProject : Project) : Promise<SystemConfiguration> {
    const project = usedProject ? usedProject : ProjectsMutations.getCurrentlySelected().toEntity();
    const newConfig = SystemConfiguration.newEmpty(project.identifier, getNextVersion(project.listVersions()));
    project.addVersion(newConfig.toVersionInfo());
    systemConfigurationsStore.items.update((current) => {
      current.push(new SystemConfigurationStore(newConfig));
      return current;
    });

    const now = new Date(Date.now());
    project.updatedAt = now;
    await ConfigurationFileSystemController.update(project, newConfig);
    await ProjectsFileSystemController.update(project);

    ProjectsMutations.updateFromEntity(project);
    return newConfig;
  }

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

  public static async updateFromVersionInfo (project : Project, versionInfo : ProjectVersionInfo) : Promise<void> {
    const configuration = await ConfigurationFileSystemController
      .readConfigurationFile(project, versionInfo.identifier);
    configuration.version =  versionInfo.version;
    configuration.name = versionInfo.name;
    configuration.updatedAt = new Date(Date.now());
    versionInfo.updatedAt = configuration.updatedAt.toISOString();

    await ConfigurationFileSystemController.update(project, configuration);
  }

  public static async archive (parentProject : Project, configurationId : string) : Promise<void> {
    await ConfigurationFileSystemController.archiveConfiguration(parentProject, configurationId);
    parentProject.removeVersionById(configurationId);
    await ProjectsController.update(parentProject);
    SystemConfigurationMutations.removeConfiguration(configurationId);
  }

  public static async duplicateConfiguration (parentProject : Project, configId : string) : Promise<void> {
    const systemConfiguration = await ConfigurationFileSystemController.readConfigurationFile(parentProject, configId);
    const newConfigEntity = systemConfiguration.cloneToNewVersion(parentProject);

    parentProject.addVersion(newConfigEntity.toVersionInfo());
    await ProjectsFileSystemController.update(parentProject);
    return ConfigurationFileSystemController.update(parentProject, newConfigEntity).then(async () => {
      await ProjectsController.loadProject(parentProject.identifier);
    });
  }
}
