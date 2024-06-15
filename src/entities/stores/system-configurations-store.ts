import { Readable, Writable, get, readable, writable } from "svelte/store";
import { SystemConfiguration } from "../models/system-configuration";
import { SelectedGenericStore } from "./selected-generic-store";
import { SchemaStore } from "./schema-store";
import { StoreEntityModel } from "../models/store-model";
import { EnvironmentVariableStore } from "./environment-variable-store";
import { BusinessOperationStore } from "./business-operation-store";
import { AddonStore } from "./addon-store";
import { nanoid } from "nanoid";

export class SystemConfigurationStore implements StoreEntityModel<SystemConfiguration> {
  public readonly identifier : string;
  public readonly name : Writable<string> = writable("");
  public readonly version : Writable<string> = writable("");
  public readonly envs : Writable<EnvironmentVariableStore[]> = writable([]);
  public readonly schemas : Writable<SchemaStore[]> = writable([]);
  public readonly businessOperations : Writable<BusinessOperationStore[]> = writable([]);
  public readonly addons : Writable<AddonStore[]> = writable([]);
  public readonly projectId : Writable<string> = writable("");
  public readonly createdAt : Readable<Date>;
  public readonly updatedAt : Writable<Date> = writable(new Date());

  private readonly originalConfiguration : SystemConfiguration;

  public constructor (configuration : SystemConfiguration) {
    this.originalConfiguration = configuration;

    this.identifier = configuration.identifier;
    this.name.set(configuration.name);
    this.version.set(configuration.version);
    this.envs.set(configuration.envs.map(e => new EnvironmentVariableStore({ ...e, identifier: nanoid() })) ?? []);
    this.schemas.set(configuration.schemas.map(s => new SchemaStore(s)));
    this.businessOperations.set(configuration.businessOperations.map(b => new BusinessOperationStore(b)));
    this.addons.set(configuration.addons.map(a => new AddonStore(a)));
    this.projectId.set(configuration.projectId);
    this.updatedAt.set(new Date(configuration.updatedAt));

    this.createdAt = readable(new Date(configuration.createdAt));
  }

  public toEntity () : SystemConfiguration {
    const result = new SystemConfiguration({
      name: get(this.name),
      version: get(this.version),
      envs: get(this.envs).map(e => e.toEntity()),
      schemas: get(this.schemas).map(s => s.toEntity()),
      businessOperations: get(this.businessOperations).map(b => b.toEntity()),
      addons: get(this.addons).map(a => a.toEntity()),
      identifier: this.identifier,
    } ,get(this.projectId));

    return result;
  }

  // TODO verify this typing
  public toJson : never;
  public duplicate : never;
  public toVersionInfo : never;
  public cloneToNewVersion : never;
}

export const systemConfigurationsStore = new SelectedGenericStore<SystemConfigurationStore>();
