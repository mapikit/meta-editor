import type { CoordinateInfo } from "../../../common/types/geometry";
import { get } from "svelte/store";
import type { ConnectionPointVertex } from "./connection-vertex";

export type StrokeStyle = { stroke : string; dash : number[]; thickness ?: number };

export type DrawableConnection = {
  strokeStyle : StrokeStyle;
  startCoords : CoordinateInfo;
  endCoords : CoordinateInfo;
  startId ?: string;
  endId ?: string;
}

/**
 * This represents the connection between two properties of modules
 */
export class ModuleConnection {
  public readonly connectionOrigin : ConnectionPointVertex;
  public readonly connectionTarget : ConnectionPointVertex;
  public readonly mode : "normal" | "functional" | "module";
  private optimalOriginId = "";
  private optimalTargetId = "";
  private hasDuplicate = false;

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

  public setOptimalConnectionIds (originId : string, targetId : string) : void {
    this.optimalOriginId = originId;
    this.optimalTargetId = targetId;
  }

  private isOptimal () : boolean {
    return this.optimalOriginId === this.connectionOrigin.id &&
      this.optimalTargetId === this.connectionTarget.id;
  }

  public setDuplicate () : void {
    this.hasDuplicate = true;
  }

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
      startCoords: origin?.coordinates ?? { x: undefined, y: undefined },
      endCoords: target?.coordinates ?? { x: undefined, y: undefined },
    };
  }

  private getStrokeStyle () : StrokeStyle {
    return {
      stroke: !this.isOptimal() ?
        `${ModuleConnection.StrokeColors[this.mode]}60` : ModuleConnection.StrokeColors[this.mode],
      dash: [],
      thickness: this.hasDuplicate ? 5 : 2,
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
};
