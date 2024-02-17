import { Addon } from "meta-system/dist/src/configuration/addon-type";
import { BusinessOperationType } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { SchemaType } from "meta-system/dist/src/configuration/schemas/schemas-type";
import { EnvironmentVariableEntity } from "meta-system/dist/src/entities/system-context";
import { Readable, Writable, get, readable, writable } from "svelte/store";
import { StoreEntityModel } from "../models/store-model";
import { SystemConfiguration } from "../models/system-configuration";
import { SelectedGenericStore } from "./selected-generic-store";

export class SystemConfigurationStore implements StoreEntityModel<SystemConfiguration> {
  public readonly identifier : string;
  public readonly name : Writable<string> = writable("");
  public readonly version : Writable<string> = writable("");
  public readonly envs : Writable<EnvironmentVariableEntity[]> = writable([]);
  public readonly schemas : Writable<SchemaType[]> = writable([]);
  public readonly businessOperations : Writable<BusinessOperationType[]> = writable([]);
  public readonly addons : Writable<Addon[]> = writable([]);
  public readonly projectId : Writable<string> = writable("");
  public readonly createdAt : Readable<Date>;
  public readonly updatedAt : Writable<Date> = writable(new Date());

  private readonly originalConfiguration : SystemConfiguration;

  public constructor (configuration : SystemConfiguration) {
    this.originalConfiguration = configuration;

    this.identifier = configuration.identifier;
    this.name.set(configuration.name);
    this.version.set(configuration.version);
    this.envs.set(configuration.envs ?? []);
    this.schemas.set(configuration.schemas);
    this.businessOperations.set(configuration.businessOperations);
    this.addons.set(configuration.addons);
    this.projectId.set(configuration.projectId);
    this.updatedAt.set(new Date(configuration.updatedAt));

    this.createdAt = readable(new Date(configuration.createdAt));
  }

  public toEntity () : SystemConfiguration {
    const result = new SystemConfiguration();

    result.name = get(this.name);
    result.version = get(this.version);
    result.envs = get(this.envs);
    result.schemas = get(this.schemas);
    result.businessOperations = get(this.businessOperations);
    result.addons = get(this.addons);
    result.projectId = get(this.projectId);
    result.createdAt = get(this.createdAt);
    result.updatedAt = get(this.updatedAt);

    return result;
  }

  // TODO verify this typing
  public toJson : never;
  public duplicate : never;
}

export const systemConfigurationsStore = new SelectedGenericStore<SystemConfigurationStore>();
