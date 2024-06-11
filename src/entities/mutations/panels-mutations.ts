import { nanoid } from "nanoid";
import { SystemConfiguration } from "../models/system-configuration";
import { PanelsStore, availablePanels } from "../stores/panels-store";
import { EditorEntityValue } from "src/entities/models/editor-entity-value";
import { DockPanelContent, DockPanelType } from "../models/view-related/dock-panel-content";
import { BusinessOperationType } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { EnvironmentVariableEntity } from "meta-system/dist/src/entities/system-context";
import { SchemaType } from "meta-system/dist/src/configuration/schemas/schemas-type";
import { TypedKeys } from "src/common/types/typed-keys";
import { systemConfigurationsStore } from "../stores/system-configurations-store";
import { get } from "svelte/store";

export class PanelsMutations {
  // eslint-disable-next-line max-lines-per-function
  public static SetAvailableViewsByLoadingConfiguration (configuration : SystemConfiguration) : void {
    const matchingConfigurationStore = systemConfigurationsStore.getItemById(configuration.identifier);
    const entityMapper = <T extends EditorEntityValue>(
      entityKey : TypedKeys<T, string>, type : DockPanelType,
    ) => (entity : T) : DockPanelContent<T> => {
      return new DockPanelContent<T>(entityKey, type, entity);
    };

    const createIdentifierToValue = <T extends object>(value : T) : {value : T} & EditorEntityValue => {
      return { identifier: nanoid(), value };
    };

    // eslint-disable-next-line max-lines-per-function
    availablePanels.allAvailablePanels.update(() => {
      return [].concat(
        get(matchingConfigurationStore.addons)
          .map(entityMapper("identifier", "Addon Configure")),
        get(matchingConfigurationStore.businessOperations)
          .map(entityMapper<BusinessOperationType>("identifier", "Business Operations")),
        (get(matchingConfigurationStore.envs) ?? [])
          .map(entityMapper<EnvironmentVariableEntity>("key", "Environment Variables")),
        get(matchingConfigurationStore.schemas)
          .map(entityMapper<SchemaType>("name", "Schema Details")),
        get(matchingConfigurationStore.schemas)
          .map(entityMapper<SchemaType>("name", "Configure Schema")),
        [new DockPanelContent("identifier", "Overview", matchingConfigurationStore)],
        [new DockPanelContent("identifier", "Addons", createIdentifierToValue(matchingConfigurationStore.addons))],
        [new DockPanelContent("identifier", "Addons Timeline",
          createIdentifierToValue(matchingConfigurationStore.addons))],
        [new DockPanelContent("identifier", "Schemas", createIdentifierToValue(matchingConfigurationStore.schemas))],
        [new DockPanelContent("identifier", "Business Operations",
          createIdentifierToValue(matchingConfigurationStore.businessOperations))],
        [new DockPanelContent("identifier", "Environment Variables",
          createIdentifierToValue(matchingConfigurationStore.envs ?? []))],
      );
    });
  }

  public static applyPanelChange <T extends EditorEntityValue>
  (view : PanelsStore<T>, viewData : DockPanelContent<T>) : void {
    view.entityPanelData.set(viewData.entityPanelData);
    view.title.set(viewData.title);
    view.panelType.set(viewData.type);
    view.typeHistory.update(history => {
      history.push(viewData);
      return history;
    });
  }
}
