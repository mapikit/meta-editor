import { ConfigurationType } from "meta-system";
import { EntityValue } from "meta-system/dist/src/entities/meta-entity";
import { EnvironmentVariableEntity } from "meta-system/dist/src/entities/system-context";

export type EditorSystemConfiguration = EntityValue<ConfigurationType>
& { envs : EntityValue<EnvironmentVariableEntity>[] }
