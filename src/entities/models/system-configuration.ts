import { ConfigurationType } from "meta-system";
import { Addon } from "meta-system/dist/src/configuration/addon-type";
import { BusinessOperationType } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { SchemaType } from "meta-system/dist/src/configuration/schemas/schemas-type";
import { EnvironmentVariableEntity } from "meta-system/dist/src/entities/system-context";
import { nanoid } from "nanoid";
import { EditorEntityValue } from "./editor-entity-value";
import { ProjectVersionInfo } from "src/common/types/serializables/project-config-type";
import { EntityValue } from "meta-system/dist/src/entities/meta-entity";

export class SystemConfiguration implements ConfigurationType, EditorEntityValue {
  constructor (configInfo : EntityValue<ConfigurationType>, projectId : string) {
    this.name = configInfo.name;
    this.version = configInfo.version;
    this.envs = configInfo.envs.map(env => ({ ...env, identifier: nanoid() })) ?? [];
    this.schemas = configInfo.schemas ?? [];
    this.businessOperations = configInfo.businessOperations ?? [];
    this.addons = configInfo.addons ?? [];
    this.projectId = projectId;
    this.identifier = configInfo.identifier;
  }

  public identifier : string = nanoid();
  public name : string;
  public version : string;
  public envs ?: EnvironmentVariableEntity[];
  public schemas : SchemaType[];
  public businessOperations : BusinessOperationType[];
  public addons : Addon[];
  public projectId : string;
  public createdAt : Date = new Date(Date.now());
  public updatedAt : Date = new Date(Date.now());

  public toJson () : EntityValue<ConfigurationType> {
    return {
      name: this.name,
      version: this.version,
      businessOperations: this.businessOperations,
      schemas: this.schemas,
      envs: this.envs,
      addons: this.addons,
      identifier: this.identifier,
    };
  }

  public toVersionInfo () : ProjectVersionInfo {
    return {
      identifier: this.identifier,
      version: this.version,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  public get duplicate () : ConfigurationType {
    return {
      name: this.name,
      version: this.version,
      businessOperations: this.businessOperations,
      schemas: this.schemas,
      envs: this.envs,
      addons: this.addons,
    };
  }

  public static newEmpty (projectId : string) : SystemConfiguration {
    return new SystemConfiguration({
      name: "New Version Name",
      version: "0.0.1",
      businessOperations: [],
      schemas: [],
      addons: [],
      envs: [],
      identifier: nanoid(),
    }, projectId);
  }
}

