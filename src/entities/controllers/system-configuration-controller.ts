import { SystemConfiguration } from "../models/system-configuration";
import { SystemConfigurationMutations } from "../mutations/system-configuration-mutations";
import { PanelsMutations } from "../mutations/panels-mutations";
import { ConfigurationFileSystemController } from "./file-system-controller-functions/versions";
import { Project } from "../models/project";
import { ProjectsController } from "./projects-controller";
import { ProjectsMutations } from "../mutations/projects-mutations";
import { getNextVersion } from "../../electron/helpers/get-next-version";
import { SystemConfigurationStore, systemConfigurationsStore } from "../stores/system-configurations-store";
import { ProjectsFileSystemController } from "./file-system-controller-functions/projects";

export class SystemConfigurationController {
  /** Creates a new empty configuration at the currently open project */
  public static async createNewEmptyConfiguration () : Promise<SystemConfiguration> {
    const currentProject = ProjectsMutations.getCurrentlySelected();
    const newConfig = SystemConfiguration.newEmpty(currentProject.identifier);
    currentProject.versions.update(c => c.concat([newConfig.toVersionInfo()]));
    systemConfigurationsStore.items.update((current) => {
      current.push(new SystemConfigurationStore(newConfig));
      return current;
    });

    const projectEntity = currentProject.toEntity();
    await ConfigurationFileSystemController.update(projectEntity, newConfig);
    await ProjectsFileSystemController.update(projectEntity);

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

  public static async archive (parentProject : Project, configurationId : string) : Promise<void> {
    const versionInfo = parentProject.versions.find(version => version.identifier == configurationId);
    return ConfigurationFileSystemController.archiveConfiguration(parentProject, versionInfo).then(() => {
      SystemConfigurationMutations.removeConfiguration(configurationId);
      ProjectsMutations.updateLoadedProject(parentProject);
    });
  }

  public static async duplicateConfiguration (parentProject : Project, configId : string) : Promise<void> {
    const configInfo = await ConfigurationFileSystemController.readConfigurationFile(parentProject, configId);
    const newConfigEntity = new SystemConfiguration({
      ...configInfo,
      version: getNextVersion(parentProject.versions.map(version => version.version)),
    }, parentProject.identifier);

    return ConfigurationFileSystemController.update(parentProject, newConfigEntity).then(async () => {
      await ProjectsController.loadProject(parentProject.identifier);
    });
  }
}
