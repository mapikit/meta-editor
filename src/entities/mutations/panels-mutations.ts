import { SystemConfiguration } from "../models/system-configuration";
import { PanelStore, availablePanels } from "../stores/panels-store";
import { EditorEntityValue } from "src/entities/models/editor-entity-value";
import { DockPanelContent, DockPanelType } from "../models/view-related/dock-panel-content";
import { BusinessOperationType } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { EnvironmentVariableEntity } from "meta-system/dist/src/entities/system-context";
import { TypedKeys } from "src/common/types/typed-keys";
import { systemConfigurationsStore } from "../stores/system-configurations-store";
import { Readable, get } from "svelte/store";
import { StoreEntityModel } from "../models/store-model";
import { Schema } from "../models/schema";

type PossibleTitleKeys<T extends EditorEntityValue> =
  TypedKeys<StoreEntityModel<T>, string> | TypedKeys<StoreEntityModel<T>, Readable<string>>;

export class PanelsMutations {
  // eslint-disable-next-line max-lines-per-function
  public static SetAvailableViewsByLoadingConfiguration (configuration : SystemConfiguration) : void {
    const matchingConfigurationStore = systemConfigurationsStore.getItemById(configuration.identifier);

    const entityMapper = <T extends EditorEntityValue>(
      entityKey : PossibleTitleKeys<T>, type : DockPanelType,
    ) => (entity : StoreEntityModel<T>) : DockPanelContent<T, StoreEntityModel<T>> => {
      return new DockPanelContent<T, StoreEntityModel<T>>(type, entity, entityKey as string);
    };

    const createIdentifierToValue = <T extends object >(value : T, id : string)
    : StoreEntityModel<{ identifier : string, value : T }> => {
      const result = {
        identifier: id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: value as any,
        toEntity: function () {
          return result;
        },
      };

      return result;
    };

    // eslint-disable-next-line max-lines-per-function
    availablePanels.allAvailablePanels.update(() => {
      const configId = matchingConfigurationStore.identifier;
      return [].concat(
        get(matchingConfigurationStore.addons)
          .map(entityMapper("identifier", "Addon Configure")),
        get(matchingConfigurationStore.businessOperations)
          .map(entityMapper<BusinessOperationType>("identifier", "Business Operations")),
        (get(matchingConfigurationStore.envs) ?? [])
          .map(entityMapper<EnvironmentVariableEntity>("key", "Environment Variables")),
        get(matchingConfigurationStore.schemas)
          .map(entityMapper<Schema>("name", "Configure Schema")),
        [new DockPanelContent("Overview", matchingConfigurationStore)],
        [new DockPanelContent("Addons",
          createIdentifierToValue(matchingConfigurationStore.addons, configId))],
        [new DockPanelContent("Addons Timeline",
          createIdentifierToValue(matchingConfigurationStore.addons, configId))],
        [new DockPanelContent("Schemas",
          createIdentifierToValue(matchingConfigurationStore.schemas, configId))],
        [new DockPanelContent("Business Operations",
          createIdentifierToValue(matchingConfigurationStore.businessOperations, configId))],
        [new DockPanelContent("Environment Variables",
          createIdentifierToValue(matchingConfigurationStore.envs ?? [], configId))],
      );
    });
  }

  public static applyPanelChange (view : PanelStore, viewData : DockPanelContent) : void {
    view.panelContent.set(viewData);
    view.title.set(viewData.title);
    view.panelType.set(viewData.type);
    view.typeHistory.update(history => {
      history.push(viewData);
      return history;
    });
  }

  public static goBackPanel (view : PanelStore) : void {
    let lastContent : DockPanelContent;
    console.log();
    view.typeHistory.update(current => {
      current.pop();
      lastContent = current[current.length -1];
      return current;
    });

    if (!lastContent) return;

    view.panelContent.set(lastContent);
    view.title.set(lastContent.title);
    view.panelType.set(lastContent.type);
  }

  public static getPanelFromTypeAndIdentifier (type : DockPanelType, id : string) : DockPanelContent {
    return get(availablePanels.allAvailablePanels).find((dockContent) => {
      return dockContent.identifier === id && dockContent.type === type;
    });
  }
}
