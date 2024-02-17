import { SystemConfiguration } from "../models/system-configuration";
import { SystemConfigurationStore, systemConfigurationsStore } from "../stores/system-configurations-store";

export class SystemConfigurationMutations {
  public static loadConfiguration (configurationId : string) : void {
    if (!systemConfigurationsStore.hasItem(configurationId)) { return; }

    systemConfigurationsStore.currentlyOpenItemId.set(configurationId);
  }

  public static addConfiguration (configuration : SystemConfiguration) : void {
    systemConfigurationsStore.items.update((current) => {
      current.push(new SystemConfigurationStore(configuration));

      return current;
    });
  }
}
