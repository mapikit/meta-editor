import { nanoid } from "nanoid";
import { SystemConfiguration } from "../models/system-configuration";
import { SystemConfigurationMutations } from "../mutations/system-configuration-mutations";
import { PanelsMutations } from "../mutations/panels-mutations";
import { systemConfigurationsStore } from "../stores/system-configurations-store";

export class SystemConfigurationController {
  public static loadConfigurationIntoView (configurationId : string) : void {
    const configuration = systemConfigurationsStore.getItemById(configurationId);

    SystemConfigurationMutations.loadConfiguration(configurationId);
    PanelsMutations.SetAvailableViewsByLoadingConfiguration(configuration.toEntity());
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
