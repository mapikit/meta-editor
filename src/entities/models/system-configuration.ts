import { ConfigurationType } from "meta-system";
import { Addon } from "meta-system/dist/src/configuration/addon-type";
import { BusinessOperationType } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { SchemaType } from "meta-system/dist/src/configuration/schemas/schemas-type";
import { EnvironmentVariableEntity } from "meta-system/dist/src/entities/system-context";
import { nanoid } from "nanoid";
import { EditorEntityValue } from "./editor-entity-value";

export class SystemConfiguration implements ConfigurationType, EditorEntityValue {
  constructor (configInfo ?: Partial<ConfigurationType & { identifier : string }>, projectId ?: string) {
    this.identifier = configInfo?.identifier ?? this.identifier;
    this.name = configInfo?.name;
    this.version = configInfo?.version;
    this.envs = configInfo?.envs?.map(env => ({ ...env, identifier: nanoid() }));
    this.schemas = configInfo?.schemas;
    this.businessOperations = configInfo?.businessOperations;
    this.addons = configInfo?.addons;
    this.projectId = projectId;
  }

  public identifier : string = nanoid();
  public name : string;
  public version : string;
  public envs ?: EnvironmentVariableEntity[];
  public schemas : SchemaType[];
  public businessOperations : BusinessOperationType[];
  public addons : Addon[];
  public projectId : string;
  public createdAt : Date;
  public updatedAt : Date;

  public toJson () : ConfigurationType {
    return {
      name: this.name,
      version: this.version,
      businessOperations: this.businessOperations,
      schemas: this.schemas,
      envs: this.envs,
      addons: this.addons,
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
}

