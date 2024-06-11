import { get } from "svelte/store";
import { SystemConfiguration } from "../models/system-configuration";
import { SystemConfigurationStore, systemConfigurationsStore } from "../stores/system-configurations-store";
import { Schema } from "../models/schema";

export class SystemConfigurationMutations {
  public static openConfiguration (configurationId : string) : void {
    if (!systemConfigurationsStore.hasItem(configurationId)) { return; }

    systemConfigurationsStore.currentlyOpenItemId.set(configurationId);
  }

  public static addConfiguration (configuration : SystemConfiguration) : void {
    if (systemConfigurationsStore.hasItem(configuration.identifier)) { return; }

    systemConfigurationsStore.items.update((current) => {
      current.push(new SystemConfigurationStore(configuration));
      return current;
    });
  }

  public static updateConfiguration (configuration : SystemConfiguration) : void {
    if (!this.configIsLoaded(configuration.identifier)) { return; }
    systemConfigurationsStore.items.update((configs) => {
      const configIndex = configs.findIndex(config => config.identifier === configuration.identifier);
      configs[configIndex] = new SystemConfigurationStore(configuration);
      return configs;
    });
  }

  public static getConfigInfo (configId : string) : SystemConfiguration {
    const configInfo = get(systemConfigurationsStore.items).find(config => config.identifier === configId);
    if(!configInfo) console.error("No config found with id", configId);
    return configInfo.toEntity();
  }

  public static configIsLoaded (configId : string) : boolean {
    return systemConfigurationsStore.hasItem(configId);
  }

  public static removeConfigurationsByProjectId (projectId : string) : void {
    systemConfigurationsStore.items.update(configurations => {
      return configurations.filter(config => get(config.projectId) !== projectId);
    });
  }

  public static removeConfiguration (configId : string) : void {
    systemConfigurationsStore.items.update(configurations => {
      return configurations.filter(config => config.identifier !== configId);
    });
  }

  public static setAvailableConfigurations (configurations : SystemConfiguration[]) : void {
    systemConfigurationsStore.items.set(configurations.map(cf => new SystemConfigurationStore(cf)));
    systemConfigurationsStore.currentlyOpenItemId.set(null);
  }

  // Editor Functions

  public static addNewEmptySchema () : void {
    const currentConfig = get(systemConfigurationsStore.currentlyOpenItems);
    if (!currentConfig) { return; }

    currentConfig.schemas.update(v => v.concat([Schema.newEmpty()]));
  }
}
