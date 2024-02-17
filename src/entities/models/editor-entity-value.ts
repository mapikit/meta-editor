import { EntityValue } from "meta-system/dist/src/entities/meta-entity";

export type EditorEntityValue<T extends EntityValue = { identifier : string }> = T;
