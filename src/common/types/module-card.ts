import type { ObjectDefinition } from "@meta-system/object-definition";
import type { BopsConfigurationEntry, Dependency, ModuleType }
  from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { nanoid } from "nanoid";
import { get, writable, Writable } from "svelte/store";
import { Coordinate, CoordinateInfo, Dimensions } from "./geometry";
import { FunctionsInfo } from "../../components/architect/helpers/functions-info";
import type { Serialized } from "../../entities/serialized-type";

export type UICompliantDependency = Dependency & {
  matchingType ?: boolean;
}

export interface SerializedModuleCard extends BopsConfigurationEntry {
  id : string;
  position : CoordinateInfo;
  dimensions ?: Dimensions;
  bopId : string;
  dependencies : Array<UICompliantDependency>;
  storedDefinition : {
    input : ObjectDefinition;
    output : ObjectDefinition;
  };
}

export class ModuleCard {
  public readonly id : string;
  public readonly position : Writable<Coordinate> = writable(new Coordinate(0, 0));
  public readonly dimensions : Dimensions = { height: 0, width: 0 };
  public readonly bopId : string;
  public readonly dependencies : Writable<UICompliantDependency[]> = writable([]);
  public readonly storedDefinition : Writable<SerializedModuleCard["storedDefinition"]> = writable(
    { input: {}, output: {} },
  );

  public readonly moduleType : ModuleType;
  public readonly moduleName : string;
  public readonly key : number;
  public readonly modulePackage : string;

  // eslint-disable-next-line max-lines-per-function
  public static generate (generationArgs : {
    position : Coordinate;
    bopId : string;
    moduleType : ModuleType;
    moduleName : string;
    key : number;
    modulePackage ?: string })
    : ModuleCard {
    const result = new ModuleCard({
      id: nanoid(),
      position: generationArgs.position,
      bopId: generationArgs.bopId,
      moduleName: generationArgs.moduleName,
      moduleType: generationArgs.moduleType,
      modulePackage: generationArgs.modulePackage,
      key: generationArgs.key,
      dependencies: [],
      storedDefinition: { input: {}, output: {} },
    });

    const inputOutputData = FunctionsInfo.getCardInfo(result);

    result.storedDefinition.set({
      input: inputOutputData?.input ?? {},
      output: inputOutputData?.output ?? {},
    });

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  public constructor (parameters : SerializedModuleCard) {
    this.id = parameters.id;
    this.position.set(new Coordinate(parameters.position.x, parameters.position.y));
    this.dimensions = parameters.dimensions ?? { height: 0, width: 0 };
    this.bopId = parameters.bopId;
    this.dependencies.set(parameters.dependencies);
    this.moduleName = parameters.moduleName;
    this.moduleType = parameters.moduleType;
    this.key = parameters.key;
    this.modulePackage = parameters.modulePackage;

    this.serialize = this.serialize.bind(this);

    if (parameters.storedDefinition) {
      this.storedDefinition.set(parameters.storedDefinition);
    } else {
      const inputOutputData = FunctionsInfo.getCardInfo(this);
      this.storedDefinition.set({
        input: inputOutputData?.input ?? {},
        output: inputOutputData?.output ?? {},
      });
    }
  }

  public serialize () : Serialized<ModuleCard> {
    return ({
      id: this.id,
      position: get(this.position),
      dimensions: this.dimensions,
      bopId: this.bopId,
      dependencies: get(this.dependencies),
      storedDefinition: get(this.storedDefinition),
      moduleName: this.moduleName,
      moduleType: this.moduleType,
      modulePackage: this.modulePackage,
      key: this.key,
    });
  }

  /** We used -1 as the key for the input, but such thing does not exist
   * in meta-system, so use this as a "translator"
   */
  public getBopTransformedKey () : number | "input" {
    return this.key === -1 ? "input" : this.key;
  }
}
