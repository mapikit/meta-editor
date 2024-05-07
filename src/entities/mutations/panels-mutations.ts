import { nanoid } from "nanoid";
import { SystemConfiguration } from "../models/system-configuration";
import { PanelsStore, availablePanels } from "../stores/panels-store";
import { EditorEntityValue } from "src/entities/models/editor-entity-value";
import { DockPanelContent, DockPanelType } from "../models/dock-panel-content";
import { BusinessOperationType } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { EnvironmentVariableEntity } from "meta-system/dist/src/entities/system-context";
import { SchemaType } from "meta-system/dist/src/configuration/schemas/schemas-type";
import { TypedKeys } from "src/common/types/typed-keys";

export class PanelsMutations {
  // eslint-disable-next-line max-lines-per-function
  public static SetAvailableViewsByLoadingConfiguration (configuration : SystemConfiguration) : void {
    const entityMapper = <T extends EditorEntityValue>(
      entityKey : TypedKeys<T, string>, type : DockPanelType,
    ) => (entity : T) : DockPanelContent<T> => {
      return new DockPanelContent<T>(entityKey, type, entity);
    };

    const createIdentifierToValue = <T extends object>(value : T) : {value : T} & EditorEntityValue => {
      return { identifier: nanoid(), value };
    };

    availablePanels.allAvailablePanels.update(() => {
      return [].concat(
        configuration.addons.map(entityMapper("identifier", "Addon Configure")),
        configuration.businessOperations.map(entityMapper<BusinessOperationType>("identifier", "Business Operations")),
        ((configuration.envs) ?? []).map(entityMapper<EnvironmentVariableEntity>("key", "Environment Variables")),
        configuration.schemas.map(entityMapper<SchemaType>("name", "Schema Details")),
        configuration.schemas.map(entityMapper<SchemaType>("name", "Configure Schema")),
        [new DockPanelContent("identifier", "Overview", configuration)],
        [new DockPanelContent("identifier", "Addons", createIdentifierToValue(configuration.addons))],
        [new DockPanelContent("identifier", "Addons Timeline", createIdentifierToValue(configuration.addons))],
        [new DockPanelContent("identifier", "Schemas", createIdentifierToValue(configuration.schemas))],
        [new DockPanelContent("identifier", "Business Operations",
          createIdentifierToValue(configuration.businessOperations))],
        [new DockPanelContent("identifier", "Environment Variables",
          createIdentifierToValue(configuration.envs ?? []))],
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
