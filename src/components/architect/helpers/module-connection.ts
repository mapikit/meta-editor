import type { ObjectDefinition } from "@meta-system/object-definition";
import type { CoordinateInfo } from "../../../common/types/geometry";
import { get } from "svelte/store";
import type { ConnectionPointVertex } from "./connection-vertex";

export type StrokeStyle = { stroke : string; dash : number[]; thickness ?: number };

export type DrawableConnection = {
  strokeStyle : StrokeStyle;
  startCoords : CoordinateInfo;
  endCoords : CoordinateInfo;
}

/**
 * This represents the connection between two properties of modules
 */
export class ModuleConnection {
  public readonly connectionOrigin : ConnectionPointVertex;
  public readonly connectionTarget : ConnectionPointVertex;
  public readonly mode : "normal" | "functional" | "module";

  public constructor (
    origin : ConnectionPointVertex,
    target : ConnectionPointVertex,
    mode : "normal" | "functional" | "module",
  ) {
    this.connectionOrigin = origin;
    this.connectionTarget = target;
    this.mode = mode;

    if ((get(this.connectionOrigin.propertyPath)
    || get(this.connectionTarget.propertyPath)) && this.mode === "functional") {
      throw Error("Functional Dependency created with paths - there was probably an error with the code");
    }

  };

  public static get StrokeColors () : Record<ModuleConnection["mode"], string> {
    return {
      normal: "#dddddd",
      functional: "#3ae6ec",
      module: "#ff9c01",
    };
  };

  public getDrawable (useFallBackOrigin ?: ConnectionPointVertex, useFallBackTarget ?: ConnectionPointVertex)
    : DrawableConnection {
    const origin = useFallBackOrigin ?? this.connectionOrigin;
    const target = useFallBackTarget ?? this.connectionTarget;

    return {
      strokeStyle: this.getStrokeStyle(),
      startCoords: origin.coordinates,
      endCoords: target.coordinates,
    };
  }

  private getStrokeStyle () : StrokeStyle {
    return {
      stroke: ModuleConnection.StrokeColors[this.mode],
      dash: [],
    };
  }


  public get originId () : string {
    return this.connectionOrigin.id;
  }

  public get targetId () : string {
    return this.connectionTarget.id;
  }

  public get canBeDrawn () : boolean {
    return (this.connectionOrigin.element && this.connectionTarget.element) !== undefined;
  }

  /** Corrects a path based on the presence of arrays in it */
  // eslint-disable-next-line max-lines-per-function
  public static solvePropertyPath (definition : ObjectDefinition, path : string[]) : string {
    let resultPath = "";

    const partialDefinition = definition;
    let isInArray = false;
    let tempData = partialDefinition;
    for (const step of path) {
      if (tempData[step]["type"] === "array") {
        resultPath += `.${step}`;
        tempData = tempData[step]["data"];
        isInArray = true;
        continue;
      }

      resultPath += isInArray ? `[${step}]` : `.${step}`;
      isInArray = false;
      tempData = tempData[step]["subtype"];
    }

    return resultPath.charAt(0) === "." ? resultPath.substring(1) : resultPath;
  }
};
