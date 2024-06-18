import { get } from "svelte/store";
import { SystemConfiguration } from "../models/system-configuration";
import { SystemConfigurationStore, systemConfigurationsStore } from "../stores/system-configurations-store";
import { Schema } from "../models/schema";
import { SchemaStore } from "../stores/schema-store";
import clone from "just-clone";
import { nanoid } from "nanoid";

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

    currentConfig.schemas.update(v => v.concat([new SchemaStore(Schema.newEmpty())]));
  }

  public static removeSchemaById (identifier : string) : void {
    const currentConfig = get(systemConfigurationsStore.currentlyOpenItems);
    if (!currentConfig) { return; }

    currentConfig.schemas.update(s => s.filter(sf => sf.identifier !== identifier));
  }

  // eslint-disable-next-line max-lines-per-function
  public static cloneSchemaById (identifier : string) : void {
    const currentConfig = get(systemConfigurationsStore.currentlyOpenItems);
    if (!currentConfig) { return; }

    currentConfig.schemas.update(s => {
      const found = s.findIndex(sf => sf.identifier === identifier);
      let result = s;
      if (found >= 0) {
        const newSchema = new SchemaStore({ ...clone(s[found].toEntity()), identifier: nanoid() });
        newSchema.name.update(name => name + " (copy)");
        result = [].concat(s.slice(0, found + 1), [newSchema], s.slice(found + 1, s.length));
      }

      return result;
    });
  }
}
