import { get } from "svelte/store";
import { availableConfigurations } from "../../stores/configuration-store";
import { storageManager } from "../../stores/storage-manager";


export function deleteSchema (versionId : string, schemaId : string) : void {
  storageManager.manager.deleteSchema(versionId, schemaId)
    .then(() => {
      availableConfigurations.update(configs => {
        const version = configs.find(config => get(config.id) === versionId);
        const index  = version.schemas.findIndex(schema => get(schema.id) === schemaId);
        version.schemas.splice(index, 1);
        return configs;
      });
    })
    .catch(err => window.alert("Error while deleting schema:\n" + err));
}

export function deleteBop (versionId : string, bopId : string) : void {
  storageManager.manager.deleteBop(versionId, bopId)
    .then(() => {
      availableConfigurations.update(configs => {
        const version = configs.find(config => get(config.id) === versionId);
        const index  = version.businessOperations.findIndex(bop => get(bop.id) === bopId);
        version.businessOperations.splice(index, 1);
        return configs;
      });
    })
    .catch(err => window.alert("Error while deleting bop:\n" + err));
}

export function deleteProtocol (versionId : string, protocolId : string) : void {
  storageManager.manager.deleteSchema(versionId, protocolId)
    .then(() => {
      availableConfigurations.update(configs => {
        const version = configs.find(config => get(config.id) === versionId);
        const index  = version.protocols.findIndex(protocol => get(protocol.id) === protocolId);
        version.protocols.splice(index, 1);
        return configs;
      });
    })
    .catch(err => window.alert("Error while deleting protocol:\n" + err));
}
