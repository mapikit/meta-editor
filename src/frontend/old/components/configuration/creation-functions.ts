import { get } from "svelte/store";
import { UIBusinessOperation } from "../../entities/business-operation";
import { Protocol } from "../../entities/protocol";
import { Schema } from "../../entities/schema";
import { availableConfigurations } from "../../stores/configuration-store";
import { storageManager } from "../../stores/storage-manager";


export function createSchema (versionId : string) : void {
  storageManager.manager.createSchema(versionId)
    .then(() => {
      availableConfigurations.update(configs => {
        configs.find(config => get(config.id) === versionId).schemas.push(Schema.createNewSchema());
        return configs;
      });
    })
    .catch(err => window.alert("Error while creating schema:\n" + err));
}

export function createProtocol (versionId : string) : void {
  storageManager.manager.createProtocol(versionId)
    .then(() => {
      availableConfigurations.update(configs => {
        configs.find(config => get(config.id) === versionId).protocols.push(Protocol.createNewProtocol());
        return configs;
      });
    })
    .catch(err => window.alert("Error while creating protocol:\n" + err));
}

export function createBop (versionId : string) : void {
  storageManager.manager.createBop(versionId)
    .then(inserted => {
      availableConfigurations.update(configs => {
        configs.find(config => get(config.id) === versionId)
          .businessOperations.push(new UIBusinessOperation(inserted));
        return configs;
      });
    })
    .catch(err => window.alert("Error while creating protocol:\n" + err));
}

