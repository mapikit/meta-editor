import { ConfigurationType } from "meta-system";
import { nanoid } from "nanoid";
import { EditorEntityValue, EditorEntityValueConcrete } from "./editor-entity-value";
import { ProjectVersionInfo } from "../../common/types/serializables/project-config-type";
import { EntityValue } from "meta-system/dist/src/entities/meta-entity";
import { getNextVersion } from "../../common/helpers/get-next-version";
import { Project } from "./project";
import { EditorSystemConfiguration } from "../../common/types/serializables/system-configuration-type";

export class SystemConfiguration extends
  (EditorEntityValue<EditorSystemConfiguration> as EditorEntityValueConcrete<EditorSystemConfiguration>) {

  public constructor (configInfo : EditorSystemConfiguration, projectId : string) {
    super(configInfo);
    this.projectId = projectId;
  }

  public projectId : string;
  public createdAt : Date = new Date(Date.now());
  public updatedAt : Date = new Date(Date.now());

  public toJson () : EntityValue<EditorSystemConfiguration> {
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
      name: this.name,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  public cloneToNewVersion (project : Project) : SystemConfiguration {
    return new SystemConfiguration({
      ...this,
      name: `${this.name} (new)`,
      version: getNextVersion(project.listVersions()),
      identifier: nanoid(),
    }, this.projectId);
  }

  public static newEmpty (projectId : string, version ?: string) : SystemConfiguration {
    return new SystemConfiguration({
      name: "New Version Name",
      version: version ?? "0.0.1",
      businessOperations: [],
      schemas: [],
      addons: [],
      envs: [],
      identifier: nanoid(),
    }, projectId);
  }

  public static fromConfigType (configInfo : ConfigurationType, projectId : string) : SystemConfiguration {
    return new SystemConfiguration(
      {
        ...configInfo,
        envs: configInfo.envs?.map(e => ({ ...e, identifier: nanoid() })) ?? [],
        identifier: nanoid(),
      },
      projectId,
    );
  }
}

