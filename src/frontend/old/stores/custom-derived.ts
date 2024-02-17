import { get } from "svelte/store";
import type { Configuration } from "../entities/configuration";
import { availableConfigurations, currentConfigId } from "./configuration-store";


type PossibleEntities = {
  [K in keyof Configuration] : Configuration[K] extends Array<unknown> ? K : never;
}[keyof Configuration]

type EntityType<K extends PossibleEntities> = Configuration[K] extends Array<infer J> ? J : never;

export type SetterType<T> = { set : (entity : T) => void }


export function getSetFunction (entityName : PossibleEntities, idOrKey : string) {
  return (newEntity : EntityType<typeof entityName>) : void  => {
    availableConfigurations.update(configs => {
      const curEntities : Array<EntityType<typeof entityName>> =
        configs.find(config => get(config.id) === get(currentConfigId))[entityName];
      const index = curEntities.findIndex(entity => get(entity["id"] ?? entity["key"]) === idOrKey);
      curEntities.splice(index, 1, newEntity);
      return configs;
    });
  };
}


