import { nanoid } from "nanoid";
import { SystemConfiguration } from "../models/system-configuration";
import { ViewStore, availableViews } from "../stores/view-store";
import { EditorEntityValue } from "src/entities/models/editor-entity-value";
import { DockViewContent, DockViewType } from "../models/dock-view-content";
import { BusinessOperationType } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { EnvironmentVariableEntity } from "meta-system/dist/src/entities/system-context";
import { SchemaType } from "meta-system/dist/src/configuration/schemas/schemas-type";
import { TypedKeys } from "src/common/types/typed-keys";

export class ViewMutations {
  // eslint-disable-next-line max-lines-per-function
  public static SetAvailableViewsByLoadingConfiguration (configuration : SystemConfiguration) : void {
    const entityMapper = <T extends EditorEntityValue>(
      entityKey : TypedKeys<T, string>, type : DockViewType,
    ) => (entity : T) : DockViewContent<T> => {
      return new DockViewContent<T>(entityKey, type, entity);
    };

    const createIdentifierToValue = <T extends object>(value : T) : {value : T} & EditorEntityValue => {
      return { identifier: nanoid(), value };
    };

    availableViews.allAvailableViews.update(() => {
      return [].concat(
        configuration.addons.map(entityMapper("identifier", "Addon Configure")),
        configuration.businessOperations.map(entityMapper<BusinessOperationType>("identifier", "Business Operations")),
        ((configuration.envs) ?? []).map(entityMapper<EnvironmentVariableEntity>("key", "Environment Variables")),
        configuration.schemas.map(entityMapper<SchemaType>("name", "Schema Details")),
        configuration.schemas.map(entityMapper<SchemaType>("name", "Configure Schema")),
        [new DockViewContent("identifier", "Overview", configuration)],
        [new DockViewContent("identifier", "Addons", createIdentifierToValue(configuration.addons))],
        [new DockViewContent("identifier", "Addons Timeline", createIdentifierToValue(configuration.addons))],
        [new DockViewContent("identifier", "Schemas", createIdentifierToValue(configuration.schemas))],
        [new DockViewContent("identifier", "Business Operations",
          createIdentifierToValue(configuration.businessOperations))],
        [new DockViewContent("identifier", "Environment Variables", createIdentifierToValue(configuration.envs ?? []))],
      );
    });
  }

  public static applyViewChange <T extends EditorEntityValue>
  (view : ViewStore<T>, viewData : DockViewContent<T>) : void {
    view.entityViewData.set(viewData.entityViewData);
    view.title.set(viewData.title);
    view.viewType.set(viewData.type);
    view.typeHistory.update(history => {
      history.push(viewData);
      return history;
    });
  }
}
